import express from "express";
import { ApiController } from "../../controllers/api.controller";
export const apiRouter = express.Router();

const apiController = new ApiController();

apiRouter.get("/credential",apiController.getCredentials);
