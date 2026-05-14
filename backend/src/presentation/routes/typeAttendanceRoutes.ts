import { Router } from "express";
import { TypeAttendanceController } from "../controllers/typeAttendanceController";

export function typeAttendanceRoutes(
  controller: TypeAttendanceController,
): Router {
  const router = Router();
  router.post("/typesAttendance", (req, res) => controller.create(req, res));
  router.put("/typesAttendance/:id", (req, res) => controller.update(req, res));
  router.get("/typesAttendance", (req, res) => controller.list(req, res));
  router.get("/typesAttendance/:id", (req, res) =>
    controller.getById(req, res),
  );
  router.delete("/typesAttendance/:id", (req, res) =>
    controller.remove(req, res),
  );
  return router;
}
