import * as companyRepository from "../repositories/companyRepository.js"; 
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { unauthorizedError, badRequest, conflictError } from '../middlewares/handleErrorsMiddleware.js';
import { faker } from '@faker-js/faker';
import moment from 'moment';
import cryptr from 'cryptr';

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

  const employeeHasOneType = await cardRepository.findByTypeAndEmployeeId(type,employeeId);
  //If the employee already has a type, I will not be able to create another one.
  if(employeeHasOneType) {
  throw conflictError();
  }

  const number = faker.finance.creditCardNumber();

  const cardholderName = Abbreviate(existingEmployee.fullName);

  const todayDate = moment();
  const expirationDate = todayDate.add(5, 'years').format('MM/YY');

  const cvvGenerator = faker.finance.creditCardCVV();
  const secretPassword = new cryptr('myTotallySecretKey');
  const encryptedString = secretPassword.encrypt(cvvGenerator);

  await cardRepository.insert({
    employeeId,
    number,
    cardholderName,
    securityCode: encryptedString,
    expirationDate,
    password: null,
    isVirtual: false,
    originalCardId: null,
    isBlocked: false,
    type,
  });
}