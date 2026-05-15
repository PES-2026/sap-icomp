import { Router } from "express";

import { CreateTypeAttendanceDTO } from "@application/dtos/typeAttendance/createTypeAttendanceDto";
import { ListTypeAttendanceDTO } from "@application/dtos/typeAttendance/listTypeAttendanceDto";
import { RemoveTypeAttendanceDTO } from "@application/dtos/typeAttendance/removeTypeAttendanceDto";
import { TypeAttendanceByIdDTO } from "@application/dtos/typeAttendance/typeAttendanceByIdDto";
import { UpdateTypeAttendanceDTO } from "@application/dtos/typeAttendance/updateTypeAttendanceDto";
import { TypeAttendanceController } from "@presentation/controllers/typeAttendanceController";
import { validateBody } from "@presentation/middlewares/validateBody";
import { validateParams } from "@presentation/middlewares/validateParams";

export function typeAttendanceRoutes(controller: TypeAttendanceController): Router {
  const router = Router();

  router.post("/typeAttendances", validateBody(CreateTypeAttendanceDTO), controller.create);
  router.put("/typeAttendances/:id", validateParams(UpdateTypeAttendanceDTO), controller.update);
  router.get("/typeAttendances", validateParams(ListTypeAttendanceDTO), controller.list);
  router.post("/typeAttendances/:id/remove", validateParams(RemoveTypeAttendanceDTO), controller.remove);
  router.get("/typeAttendances/:id", validateParams(TypeAttendanceByIdDTO), controller.getById);

  return router;
}
