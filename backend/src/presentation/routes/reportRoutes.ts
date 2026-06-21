import { Router } from "express";

import { ReportController } from "../controllers/reportController";
import { authMiddleware } from "../middlewares/auth";
import { ITokenService } from "@domain/services/tokenService";

export function reportRoutes(controller: ReportController, tokenService: ITokenService): Router {
  const router = Router();

  router.get(
    "/students/:studentId/reports/new",
    (req, res, next) => authMiddleware(tokenService, req, res, next),
    controller.getInitialData,
  );

  router.post(
    "/students/:studentId/reports/new",
    (req, res, next) => authMiddleware(tokenService, req, res, next),
    controller.create,
  );

  router.get(
    "/students/:studentId/reports/:reportId",
    (req, res, next) => authMiddleware(tokenService, req, res, next),
    controller.getById,
  );

  router.get(
    "/students/:studentId/reports",
    (req, res, next) => authMiddleware(tokenService, req, res, next),
    controller.listByStudent,
  );

  router.post(
    "/students/:studentId/reports/:reportId/edit",
    (req, res, next) => authMiddleware(tokenService, req, res, next),
    controller.edit,
  );

  return router;
}
