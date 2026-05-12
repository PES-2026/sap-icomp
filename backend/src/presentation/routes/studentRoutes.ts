import { Router } from "express";

import { StudentController } from "../controllers/studentController";

export function studentRoutes(controller: StudentController): Router {
  const router = Router();

  router.post("/students", (req, res) => controller.create(req, res));
  router.get("/students", (req, res) => controller.list(req, res));
  router.get("/students/:id", (req, res) => controller.getById(req, res));
  router.put("/students/:id", (req, res) => controller.update(req, res));
  router.post("/students/:id/remove", (req, res) => controller.remove(req, res));

  return router;
}
