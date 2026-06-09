import { Router } from "express";

import { CreateSchedulePreviewDTO } from "@application/dtos/schedule/createSchedulePreviewDto";
import { RequestScheduleDTO } from "@application/dtos/schedule/requestScheduleDto";
import { scheduleRateLimiter } from "@presentation/middlewares/rateLimiter";
import { validateBody } from "@presentation/middlewares/validateBody";

import { ScheduleController } from "../controllers/scheduleController";

export const scheduleRoutes = (controller: ScheduleController) => {
  const routes = Router();

  routes.use(scheduleRateLimiter);

  routes.post("/schedules/request", validateBody(RequestScheduleDTO), controller.request);
  routes.post("/schedule/preview", validateBody(CreateSchedulePreviewDTO), controller.preview);

  return routes;
};
