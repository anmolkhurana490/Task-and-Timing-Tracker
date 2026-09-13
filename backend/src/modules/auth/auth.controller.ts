import type { NextFunction, Response } from "express";
import type { CustomRequest } from "../../types/express.js";
import { registerService, loginService, logoutService, getMeService } from "./auth.service.js";

/** Handles account registration requests. */
export async function registerController(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const data = await registerService(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

/** Handles login requests. */
export async function loginController(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const data = await loginService(req.body);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

/** Clears the browser cookie containing the current JWT. */
export async function logoutController(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    await logoutService(req.userId as string);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}

/** Returns the authenticated user's profile. */
export async function meController(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const data = await getMeService(req.userId as string);
    res.json(data);
  } catch (error) {
    next(error);
  }
}