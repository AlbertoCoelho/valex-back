import * as companyRepository from "../repositories/companyRepository.js"; 
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { unauthorizedError, badRequest, conflictError } from '../middlewares/handleErrorsMiddleware.js';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import cryptr from 'cryptr';
const secretPassword = new cryptr(process.env.KEY_SECRET);

export const createCard = async (
  employeeId: number, 
  type: 'groceries'| 'restaurant' | 'transport' | 'education' | 'health', 
  API_KEY: string ) => {
  
  function Abbreviate(fullname: string) {
    let arrFullName = fullname.split(' ');
    let firstName = arrFullName.shift().toUpperCase();
    let lastName = arrFullName.pop().toUpperCase();
    let surname = '';

    for(let i=0; i<arrFullName.length; i++){
      if(arrFullName[i].length < 3) {
        continue;
      }
      surname += arrFullName[i].substr(0,1).toUpperCase() + ' ';
    }

    return firstName + ' ' + surname + lastName;
  }

  const existingAPIKEY = await companyRepository.findByApiKey(API_KEY);
  if(!existingAPIKEY) {
    throw unauthorizedError();
  }

  const existingEmployee = await employeeRepository.findById(employeeId);
  if(!existingEmployee) {
    throw badRequest();
  }

  const employeeHasOneType = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
  //If the employee already has a type, I will not be able to create another one.
  if(employeeHasOneType) {
  throw conflictError();
  }


  const number = faker.finance.creditCardNumber();

  const cardholderName = Abbreviate(existingEmployee.fullName);

  const todayDate = dayjs();
  const expirationDate = todayDate.add(5, 'years').format('MM/YY');
  console.log(expirationDate);

  const cvvGenerator = faker.finance.creditCardCVV();
  console.log(cvvGenerator);
  const encryptedPassword = secretPassword.encrypt(cvvGenerator);
  const decryptedString = secretPassword.decrypt(encryptedPassword);
  console.log(decryptedString);

  await cardRepository.insert({
    employeeId,
    number,
    cardholderName,
    securityCode: encryptedPassword,
    expirationDate,
    password: null,
    isVirtual: false,
    originalCardId: null,
    isBlocked: false,
    type,
  });
}

export const activateCard = async (
  id: number,
  CVC: string,
  password: string ) => {

    const existingCard = await cardRepository.findById(id);
    if(!existingCard) {
      throw badRequest();
    }

    const todayDate = dayjs().format('MM/YY');
    if(dayjs(todayDate) > dayjs(existingCard.expirationDate)) {
      throw badRequest();
    }

    if(existingCard.password) {
      throw badRequest();
    }

    const decryptedString = secretPassword.decrypt(existingCard.securityCode);
    const isCvvValid = CVC === decryptedString;

    if(!isCvvValid){
      throw unauthorizedError();
    }
    //Vai ser melhor criar um regex pois virá uma string que não pode ter letras. password.length !== 4 não é suficiente para validar.
    const validPassword = /^[0-9]{4}$/;
    if(!validPassword.test(password)) {
      throw badRequest();
    }

    const encryptedPassword = existingCard.securityCode;
    await cardRepository.update(id, {password: encryptedPassword});
}
