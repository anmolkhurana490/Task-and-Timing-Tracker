import { Router } from "express";
import { loginController, logoutController, meController, registerController } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

/** Exposes the authentication endpoints under the API router. */
export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), registerController);
authRouter.post("/login", validate(loginSchema), loginController);
authRouter.post("/logout", authMiddleware, logoutController);
authRouter.get("/me", authMiddleware, meController);