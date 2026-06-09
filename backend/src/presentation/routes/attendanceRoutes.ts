import { Router } from "express";

import { AttendancesByStudentDTO } from "@application/dtos/attendance/attendancesByStudentDto";
import { CreateAttendanceDTO } from "@application/dtos/attendance/createAttendanceDto";
import { ListAttendanceDTO } from "@application/dtos/attendance/listAttendanceDto";
import { RemoveAttendanceDTO } from "@application/dtos/attendance/removeAttendanceDto";
import { UpdateAttendanceDTO } from "@application/dtos/attendance/updateAttendanceDto";
import { validateBody } from "@presentation/middlewares/validateBody";
import { validateParams } from "@presentation/middlewares/validateParams";
import { validateParamsAndBody } from "@presentation/middlewares/validateParamsAndBody";
import { validateParamsAndQuery } from "@presentation/middlewares/validateParamsAndQuery";
import { validateQuery } from "@presentation/middlewares/validateQuery";

import { AttendanceController } from "../controllers/attendanceController";

export function attendanceRoutes(controller: AttendanceController): Router {
  const router = Router();

  router.post("/attendances", validateBody(CreateAttendanceDTO), controller.create);
  router.get("/attendances", validateQuery(ListAttendanceDTO), controller.list);
  router.put("/attendances/:id", validateParamsAndBody(UpdateAttendanceDTO), controller.update);
  router.get("/attendances/student/:id", validateParamsAndQuery(AttendancesByStudentDTO), controller.listByStudent);
  router.post("/attendances/:id/remove", validateParams(RemoveAttendanceDTO), controller.remove);
  router.get("/attendances/:id", validateParams(RemoveAttendanceDTO), controller.getById);

  return router;
}
