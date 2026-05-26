import { AuthController } from "@presentation/controllers/authController";
import { Router } from "express";

export const authRoutes = (authController: AuthController) => {
  const routes = Router();

  routes.post("/login", authController.login);
  routes.post("/logout", authController.logout);

  return routes;
};
