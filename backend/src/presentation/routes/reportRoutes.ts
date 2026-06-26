import { Router } from "express";
import rateLimit from "express-rate-limit";

import { ReportController } from "../controllers/reportController";
import { authMiddleware } from "../middlewares/auth";
import { ITokenService } from "@domain/services/tokenService";

export function reportRoutes(controller: ReportController, tokenService: ITokenService): Router {
  const router = Router();
  const reportRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });

  const auth = (req: any, res: any, next: any) => authMiddleware(tokenService, req, res, next);

  //router.get("/reports/new", reportRateLimiter, auth, controller.getInitialData);
  router.post("/reports", reportRateLimiter, auth, controller.create);
  router.get("/reports/:reportId", reportRateLimiter, auth, controller.getById);
  router.get("/:studentId/reports", reportRateLimiter, auth, controller.listByStudent);
  router.put("/reports/:reportId", reportRateLimiter, auth, controller.edit);
  router.delete("/reports/:reportId", reportRateLimiter, auth, controller.remove);

  return router;
}
