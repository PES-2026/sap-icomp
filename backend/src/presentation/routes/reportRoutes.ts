import { Router } from "express";

import { ReportController } from "../controllers/reportController";

export function reportRoutes(controller: ReportController): Router {
  const router = Router();

  router.get("/pedagogue/students/:studentId/reports/new", controller.getInitialData);

  router.post("/pedagogue/students/:studentId/reports/new", controller.create);

  router.get("/pedagogue/students/:studentId/reports/:reportId", controller.getById);

  router.get("/pedagogue/students/:studentId/reports", controller.listByStudent);

  router.post("/pedagogue/students/:studentId/reports/:reportId/edit", controller.edit);

  return router;
}
