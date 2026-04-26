import { Router } from "express";
import { AttendanceController } from "../controllers/attendanceController";

export function attendanceRoutes(controller: AttendanceController): Router {
  const router = Router();
  router.post("/attendances", controller.create);
  router.get("/attendances", controller.list);
  return router;
}
