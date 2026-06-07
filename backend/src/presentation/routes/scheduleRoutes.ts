import { Router } from "express";

import { CreateScheduleDTO } from "@application/dtos/schedule/createScheduleDto";
import { CreateSchedulePreviewDTO } from "@application/dtos/schedule/createSchedulePreviewDto";
import { validateBody } from "@presentation/middlewares/validateBody";

import { ScheduleController } from "../controllers/scheduleController";

export function scheduleRoutes(controller: ScheduleController): Router {
  const router = Router();

  router.post("/schedule/preview", validateBody(CreateSchedulePreviewDTO), controller.preview);
  router.post("/schedule", validateBody(CreateScheduleDTO), controller.create);

  return router;
}
