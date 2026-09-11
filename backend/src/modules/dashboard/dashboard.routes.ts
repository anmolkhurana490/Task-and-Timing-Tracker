import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { getDashboardController } from "./dashboard.controller.js";

/** Registers the protected daily dashboard route. */
export const dashboardRouter = Router();
dashboardRouter.get("/", authMiddleware, getDashboardController);
