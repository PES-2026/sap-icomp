import { NextFunction, Request, Response, Router } from "express";

import { CreateScheduleAvailabilityDTO } from "@application/dtos/schedule/createScheduleAvailability";
import { PreviewScheduleAvailabilityDTO } from "@application/dtos/schedule/previewScheduleAvailability";
import { RequestScheduleDTO } from "@application/dtos/schedule/requestScheduleDto";
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
  routes.post("/schedule/request", scheduleRateLimiter, validateBody(RequestScheduleDTO), controller.request);
  routes.get("/schedule/availability", auth, controller.list);
  routes.put("/schedule/availability/remove-many", auth, controller.removeMany);
  routes.put("/schedule/availability/:id/remove", auth, controller.remove);

  return routes;
};
