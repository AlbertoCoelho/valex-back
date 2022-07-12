import * as companyRepository from "../repositories/companyRepository.js"; 
import * as cardRepository from "../repositories/cardRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import { unauthorizedError, badRequest } from '../middlewares/handleErrorsMiddleware.js';
import dayjs from 'dayjs';

export const rechargeCard = async (
  id: number,
  API_KEY: string,
  amount: number
) => {

  const existingAPIKEY = await companyRepository.findByApiKey(API_KEY);
  if(!existingAPIKEY) {
    throw unauthorizedError();
  }

  const existingCard = await cardRepository.findById(id);
  if(!existingCard) {
    throw badRequest();
  }

  const todayDate = dayjs().format('MM/YY');
  if(dayjs(todayDate) > dayjs(existingCard.expirationDate)) {
    throw badRequest();
  }

  await rechargeRepository.insert({cardId: id, amount});
}