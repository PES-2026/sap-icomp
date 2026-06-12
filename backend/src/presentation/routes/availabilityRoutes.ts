import { NextFunction, Request, Response, Router } from "express";

import { PreviewAvailabilityDTO } from "@application/dtos/availability/previewAvailability";
import { ITokenService } from "@domain/services/tokenService";
import { authMiddleware } from "@presentation/middlewares/auth";
import { validateBody } from "@presentation/middlewares/validateBody";

import { AvailabilityController } from "../controllers/availabilityController";

export const availabilityRoutes = (controller: AvailabilityController, tokenService: ITokenService) => {
  const routes = Router();

  const auth = (req: Request, res: Response, next: NextFunction) => authMiddleware(tokenService, req, res, next);

  routes.post("/availability/preview", auth, validateBody(PreviewAvailabilityDTO), controller.preview);

  return routes;
};
