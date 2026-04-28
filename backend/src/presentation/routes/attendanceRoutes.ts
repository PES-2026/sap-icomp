import { Router } from "express";
import { AttendanceController } from "../controllers/attendanceController";

export function attendanceRoutes(controller: AttendanceController): Router {
  const router = Router();
  router.post("/attendances", (req, res) => controller.create(req, res));
  return router;
}
