import { Router } from "express";
import { CourseController } from "../controllers/courseController";

export function courseRoutes(controller: CourseController): Router {
  const router = Router();
  router.post("courses", (req, res) => controller.create(req, res));
  router.put("courses/:id", (req, res) => controller.update(req, res));
  router.get("courses", (req, res) => controller.list(req, res));

  return router;
}
