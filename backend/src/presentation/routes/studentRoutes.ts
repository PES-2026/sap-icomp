import { Router } from "express";

import { UpdateAttendanceDTO } from "@application/dtos/attendance/updateAttendanceDto";
import { CreateStudentDTO } from "@application/dtos/student/createStudentDto";
import { ListStudentDTO } from "@application/dtos/student/listStudentsDto";
import { RemoveStudentDTO } from "@application/dtos/student/removeStudentDto";
import { StudentByIdDTO } from "@application/dtos/student/studentByIdDto";
import { validateBody } from "@presentation/middlewares/validateBody";
import { validateParams } from "@presentation/middlewares/validateParams";
import { validateParamsAndBody } from "@presentation/middlewares/validateParamsAndBody";
import { validateQuery } from "@presentation/middlewares/validateQuery";

import { StudentController } from "../controllers/studentController";

export function studentRoutes(controller: StudentController): Router {
  const router = Router();

  router.post("/students", validateBody(CreateStudentDTO), controller.create);
  router.get("/students", validateQuery(ListStudentDTO), controller.list);
  router.get("/students/:id", validateParams(StudentByIdDTO), controller.getById);
  router.put("/students/:id", validateParamsAndBody(UpdateAttendanceDTO), controller.update);
  router.post("/students/:id/remove", validateParams(RemoveStudentDTO), controller.remove);

  return router;
}
