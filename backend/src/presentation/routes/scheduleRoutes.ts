import { NextFunction, Request, Response, Router } from "express";

import { CreateScheduleAvailabilityDTO } from "@application/dtos/schedule/createScheduleAvailability";
import { ListScheduleAvailabilityDTO } from "@application/dtos/schedule/listScheduleAvailabilityDto";
import { PreviewScheduleAvailabilityDTO } from "@application/dtos/schedule/previewScheduleAvailability";
import { RemoveScheduleSlotDTO } from "@application/dtos/schedule/removeScheduleSlotDto";
import { RemoveScheduleSlotsDTO } from "@application/dtos/schedule/removeScheduleSlotsDto";
import { RequestScheduleDTO } from "@application/dtos/schedule/requestScheduleDto";
import { ITokenService } from "@domain/services/tokenService";
import { ScheduleController } from "@presentation/controllers/scheduleController";
import { authMiddleware } from "@presentation/middlewares/auth";
import { scheduleRateLimiter } from "@presentation/middlewares/rateLimiter";
import { validateBody } from "@presentation/middlewares/validateBody";
import { validateParams } from "@presentation/middlewares/validateParams";
import { validateParamsAndQuery } from "@presentation/middlewares/validateParamsAndQuery";

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
  routes.get("/schedule/availability/:id", validateParamsAndQuery(ListScheduleAvailabilityDTO), controller.list);
  routes.put("/schedule/availability/remove-many", auth, validateBody(RemoveScheduleSlotsDTO), controller.removeMany);
  routes.put("/schedule/availability/:id/remove", auth, validateParams(RemoveScheduleSlotDTO), controller.remove);

  return routes;
};
