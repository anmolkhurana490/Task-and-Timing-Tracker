import { authRouter } from "./auth/auth.routes.js";
import { taskRouter } from "./tasks/task.routes.js";
import { timeRouter } from "./time-logs/time-logs.routes.js";
import { dashboardRouter } from "./dashboard/dashboard.routes.js";
import { Router } from "express";

const apiRouter = Router();

apiRouter.get("/", (_req, res) => {
  res.status(200).json({ message: "API V1 is working" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/tasks", taskRouter);
apiRouter.use("/time-logs", timeRouter);
apiRouter.use("/dashboard", dashboardRouter);

export default apiRouter;