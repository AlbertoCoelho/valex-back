import { Request, Response } from 'express';
import * as service from "../services/rechargeService.js";

export const rechargeCard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount } = req.body;

  const API_KEY = req.headers["x-api-key"] as string;
  if(!API_KEY){
    return res.sendStatus(401);
  }

  await service.rechargeCard(Number(id),API_KEY,amount);
  res.sendStatus(201);
}