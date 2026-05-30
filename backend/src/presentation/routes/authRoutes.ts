import { Router } from "express";

import { ITokenService } from "@domain/services/tokenService";
import { AuthController } from "@presentation/controllers/authController";
import { authMiddleware } from "@presentation/middlewares/auth";

export const authRoutes = (authController: AuthController, jwtService: ITokenService) => {
  const routes = Router();

  routes.post("/auth/login", authController.login);
  routes.get("/auth/me", (req, res, next) => authMiddleware(jwtService, req, res, next), authController.me);
  routes.post("/auth/logout", authController.logout);

  return routes;
};
