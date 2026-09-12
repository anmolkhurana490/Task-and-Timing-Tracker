import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { getDashboardController, getOutstandingController, getWeeklySummaryController } from "./dashboard.controller.js";

/** Registers the protected daily dashboard route. */
export const dashboardRouter = Router();
dashboardRouter.get("/", authMiddleware, getDashboardController);
dashboardRouter.get("/weekly", authMiddleware, getWeeklySummaryController);
dashboardRouter.get("/outstanding", authMiddleware, getOutstandingController);
