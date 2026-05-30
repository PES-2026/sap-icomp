import { Router } from "express";

import { ITokenService } from "@domain/services/tokenService";
import { AuthController } from "@presentation/controllers/authController";
import { authMiddleware } from "@presentation/middlewares/auth";
import { authRateLimiter } from "@presentation/middlewares/rateLimiter";

export const authRoutes = (authController: AuthController, jwtService: ITokenService) => {
  const routes = Router();

  routes.use(authRateLimiter);

  routes.post("/auth/login", authController.login);
  routes.get("/auth/me", (req, res, next) => authMiddleware(jwtService, req, res, next), authController.me);
  routes.post("/auth/logout", authController.logout);

  return routes;
};
