import { Router } from "express";
import { TypeAttendanceController } from "../controllers/typeAttendanceController";

export function typeAttendanceRoutes(
  controller: TypeAttendanceController,
): Router {
  const router = Router();
  router.post("/typesAttendance", (req, res) => controller.create(req, res));
  return router;
}
