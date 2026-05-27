import { AuthController } from "@presentation/controllers/authController";
import { Router } from "express";

export const authRoutes = (authController: AuthController) => {
  const routes = Router();

  routes.post("/auth/login", authController.login);
  routes.post("/auth/logout", authController.logout);

  return routes;
};
