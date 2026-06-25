import { Router } from "express";
import rateLimit from "express-rate-limit";

import { ReportController } from "../controllers/reportController";
import { authMiddleware } from "../middlewares/auth";
import { ITokenService } from "@domain/services/tokenService";

export function reportRoutes(controller: ReportController, tokenService: ITokenService): Router {
  const router = Router();

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });

  router.use(limiter);

  const auth = (req: any, res: any, next: any) => authMiddleware(tokenService, req, res, next);

  router.get("/reports/new", auth, controller.getInitialData);
  router.post("/reports", auth, controller.create);
  router.get("/reports/:reportId", auth, controller.getById);
  router.get("/reports", auth, controller.listByStudent);
  router.post("/reports/:reportId", auth, controller.edit);
  router.delete("/reports/:reportId", auth, controller.remove);

  return router;
}
