import { Router } from "express";
import * as controller from "../controllers/rechargeController.js";
import schemaValidator from "../middlewares/schemaMiddleware.js";
import rechargeCardSchema from "../schemas/rechargeCardSchema.js";

const rechargeRouter = Router();

rechargeRouter.post("/recharges/:id", schemaValidator(rechargeCardSchema), controller.rechargeCard);

export default rechargeRouter;