import { Router } from "express";
import * as controller from "../controllers/cardController.js";
import schemaValidator from "../middlewares/schemaMiddleware.js";
import createCardSchema from '../schemas/createCardSchema.js';
import activateCardSchema from "../schemas/activateCardSchema.js";

const cardsRouter = Router();

cardsRouter.post("/cards", schemaValidator(createCardSchema), controller.createCard);
cardsRouter.post("/cards/:id/activate", schemaValidator(activateCardSchema), controller.activateCard);

export default cardsRouter;