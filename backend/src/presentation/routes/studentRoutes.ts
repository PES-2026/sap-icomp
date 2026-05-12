import { Router } from "express";

import { StudentController } from "../controllers/studentController";
import { validateParams } from "@presentation/middlewares/validateParams";
import { validateBody } from "@presentation/middlewares/validateBody";
import { CreateStudentDTO } from "@application/dtos/student/createStudentDto";
import { ListStudentDTO } from "@application/dtos/student/listStudentsDto";
import { StudentByIdDTO } from "@application/dtos/student/studentByIdDto";
import { UpdateAttendanceDTO } from "@application/dtos/attendance/updateAttendanceDto";
import { RemoveStudentDTO } from "@application/dtos/student/removeStudentDto";

export function studentRoutes(controller: StudentController): Router {
  const router = Router();

  router.post("/students", validateBody(CreateStudentDTO), controller.create);
  router.get("/students", validateParams(ListStudentDTO), controller.list);
  router.get("/students/:id", validateParams(StudentByIdDTO), controller.getById);
  router.put("/students/:id", validateParams(UpdateAttendanceDTO), controller.update);
  router.post("/students/:id/remove", validateParams(RemoveStudentDTO), controller.remove);

  return router;
}
