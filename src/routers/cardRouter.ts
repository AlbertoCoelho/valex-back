import { Router } from "express";
import * as controller from "../controllers/cardController.js";
import schemaValidator from "../middlewares/schemaMiddleware.js";
import createCardSchema from '../schemas/createCardSchema.js';

const cardsRouter = Router();

cardsRouter.post("/cards", schemaValidator(createCardSchema), controller.createCard);

export default cardsRouter;