import { Router } from "express";

import { CreateSchedulePreviewDTO } from "@application/dtos/schedule/createSchedulePreviewDto";
import { validateBody } from "@presentation/middlewares/validateBody";

import { ScheduleController } from "../controllers/scheduleController";

export function scheduleRoutes(controller: ScheduleController): Router {
  const router = Router();

  router.post("/schedule/preview", validateBody(CreateSchedulePreviewDTO), controller.preview);

  return router;
}
