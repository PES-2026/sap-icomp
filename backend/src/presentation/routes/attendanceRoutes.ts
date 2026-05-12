import { Router } from "express";

import { AttendanceController } from "../controllers/attendanceController";
import { CreateAttendanceDTO } from "@application/dtos/attendance/createAttendanceDto";
import { validateBody } from "@presentation/middlewares/validateBody";
import { validateParams } from "@presentation/middlewares/validateParams";
import { ListAttendanceDTO } from "@application/dtos/attendance/listAttendanceDto";
import { UpdateAttendanceDTO } from "@application/dtos/attendance/updateAttendanceDto";
import { AttendancesByStudentDTO } from "@application/dtos/attendance/attendancesByStudentDto";
import { RemoveAttendanceDTO } from "@application/dtos/attendance/removeAttendanceDto";

export function attendanceRoutes(controller: AttendanceController): Router {
  const router = Router();

  router.post("/attendances", validateBody(CreateAttendanceDTO), controller.create);
  router.get("/attendances", validateParams(ListAttendanceDTO), controller.list);
  router.put("/attendances/:id", validateParams(UpdateAttendanceDTO), controller.update);
  router.get("/attendances/student/:id", validateParams(AttendancesByStudentDTO), controller.listByStudent);
  router.post("/attendances/:id/remove", validateParams(RemoveAttendanceDTO), controller.remove);
  router.get("/attendances/:id", validateParams(RemoveAttendanceDTO), controller.getById);

  return router;
}
