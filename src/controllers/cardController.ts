import { Request, Response } from 'express';
import * as service from "../services/cardService.js";

export const createCard = async (req: Request, res: Response) => {
  const { employeeId, cardType } = req.body;

  //API_KEY será uma string só e não um array de strings.
  //Tenho que fazer dessa forma(o acesso a propriedade do objeto headers) porque req.headers.x-api-key o javascript vai achar que estou tentando fazer alguma operação de subtração por causa do menos.
  const API_KEY = req.headers["x-api-key"] as string;

  if(!API_KEY){
    return res.sendStatus(401);
  }

  await service.createCard(employeeId, cardType, API_KEY);
  res.sendStatus(201);
}