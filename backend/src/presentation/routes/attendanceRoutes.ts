import { Router } from "express";
import { AttendanceController } from "../controllers/attendanceController";

export function attendanceRoutes(controller: AttendanceController): Router {
  const router = Router();
  router.post("/attendances", (req, res) => controller.create(req, res));
  router.get("/attendances", (req, res) => controller.list(req, res));
  router.put("/attendances/:id", (req, res) => controller.update(req, res));
  router.get("/attendances/student/:id", (req, res) =>
    controller.listByStudent(req, res),
  );
  router.post("/attendances/:id/remove", (req, res) =>
    controller.remove(req, res),
  );
  router.get("/attendances/:id", (req, res) => controller.getById(req, res));
  return router;
}
