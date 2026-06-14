import { NextFunction, Request, Response, Router } from "express";

import { CreateScheduleAvailabilityDTO } from "@application/dtos/schedule/createScheduleAvailability";
import { PreviewScheduleAvailabilityDTO } from "@application/dtos/schedule/previewScheduleAvailability";
import { ITokenService } from "@domain/services/tokenService";
import { ScheduleController } from "@presentation/controllers/scheduleController";
import { authMiddleware } from "@presentation/middlewares/auth";
import { scheduleRateLimiter } from "@presentation/middlewares/rateLimiter";
import { validateBody } from "@presentation/middlewares/validateBody";

export const scheduleRoutes = (controller: ScheduleController, tokenService: ITokenService) => {
  const routes = Router();

  const auth = (req: Request, res: Response, next: NextFunction) => authMiddleware(tokenService, req, res, next);

  routes.post(
    "/schedule/preview-availability",
    auth,
    validateBody(PreviewScheduleAvailabilityDTO),
    controller.preview,
  );
  routes.post(
    "/schedule/create-availability",
    auth,
    scheduleRateLimiter,
    validateBody(CreateScheduleAvailabilityDTO),
    controller.create,
  );

  return routes;
};
