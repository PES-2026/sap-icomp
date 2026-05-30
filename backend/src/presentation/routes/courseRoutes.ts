import { Router } from "express";

import { CourseByIdDTO } from "@application/dtos/course/courseByIdDto";
import { CreateCourseDTO } from "@application/dtos/course/createCourseDto";
import { ListCourseDTO } from "@application/dtos/course/listCourseDto";
import { RemoveCourseDTO } from "@application/dtos/course/removeCourseDto";
import { UpdateCourseDTO } from "@application/dtos/course/updateCourseDto";
import { validateBody } from "@presentation/middlewares/validateBody";
import { validateParams } from "@presentation/middlewares/validateParams";
import { validateParamsAndBody } from "@presentation/middlewares/validateParamsAndBody";
import { validateQuery } from "@presentation/middlewares/validateQuery";

import { CourseController } from "../controllers/courseController";

export function courseRoutes(controller: CourseController): Router {
  const router = Router();

  router.post("/courses", validateBody(CreateCourseDTO), controller.create);
  router.put("/courses/:id", validateParamsAndBody(UpdateCourseDTO), controller.update);
  router.get("/courses", validateQuery(ListCourseDTO), controller.list);
  router.get("/courses/:id", validateParams(CourseByIdDTO), controller.findById);
  router.post("/courses/:id/remove", validateParams(RemoveCourseDTO), controller.remove);

  return router;
}
