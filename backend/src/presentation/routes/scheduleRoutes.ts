import { Router } from "express";

import { RequestScheduleDTO } from "@application/dtos/schedule/requestScheduleDto";
import { ScheduleController } from "@presentation/controllers/scheduleController";
import { scheduleRateLimiter } from "@presentation/middlewares/rateLimiter";
import { validateBody } from "@presentation/middlewares/validateBody";

export const scheduleRoutes = (controller: ScheduleController) => {
  const routes = Router();

  routes.use(scheduleRateLimiter);

  routes.post("/public/attendances/request", validateBody(RequestScheduleDTO), controller.request);

  return routes;
};
