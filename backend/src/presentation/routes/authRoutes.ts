import { Router } from "express";

import { AuthController } from "@presentation/controllers/authController";
import { authMiddleware } from "@presentation/middlewares/auth";

export const authRoutes = (authController: AuthController) => {
  const routes = Router();

  routes.post("/auth/login", authController.login);
  routes.get("/auth/me", authMiddleware, authController.me);
  routes.post("/auth/logout", authController.logout);

  return routes;
};
