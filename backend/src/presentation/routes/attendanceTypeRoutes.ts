import { Router } from "express";

import { AttendanceTypeByIdDTO } from "@application/dtos/attendanceType/attendanceTypeByIdDto";
import { CreateAttendanceTypeDTO } from "@application/dtos/attendanceType/createAttendanceTypeDto";
import { ListAttendanceTypeDTO } from "@application/dtos/attendanceType/listAttendanceTypeDto";
import { RemoveAttendanceTypeDTO } from "@application/dtos/attendanceType/removeAttendanceTypeDto";
import { UpdateAttendanceTypeDTO } from "@application/dtos/attendanceType/updateAttendanceTypeDto";
import { AttendanceTypeController } from "@presentation/controllers/attendanceTypeController";
import { validateBody } from "@presentation/middlewares/validateBody";
import { validateParams } from "@presentation/middlewares/validateParams";

export function attendanceTypeRoutes(controller: AttendanceTypeController): Router {
  const router = Router();

  router.post("/attendance-types", validateBody(CreateAttendanceTypeDTO), controller.create);
  router.put("/attendance-types/:id", validateParams(UpdateAttendanceTypeDTO), controller.update);
  router.get("/attendance-types", validateParams(ListAttendanceTypeDTO), controller.list);
  router.post("/attendance-types/:id/remove", validateParams(RemoveAttendanceTypeDTO), controller.remove);
  router.get("/attendance-types/:id", validateParams(AttendanceTypeByIdDTO), controller.getById);

  return router;
}
