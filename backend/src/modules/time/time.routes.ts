import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { validate } from "../../middlewares/validate.js";
import { getTimeLogsController, startTimeController, stopTimeController } from "./time.controller.js";
import { startTimeSchema, timeLogIdSchema } from "./time.validation.js";

/** Registers protected time-tracking routes. */
export const timeRouter = Router();
timeRouter.use(authMiddleware);
timeRouter.get("/", getTimeLogsController);
timeRouter.post("/start", validate(startTimeSchema), startTimeController);
timeRouter.post("/:id/stop", validate(timeLogIdSchema, "params"), stopTimeController);
