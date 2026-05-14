import { Router } from "express";

import { CreateDiagnosisDTO } from "@application/dtos/diagnoses/createDiagnosisDto";
import { DiagnosesController } from "@presentation/controllers/diagnosesController";
import { validateBody } from "@presentation/middlewares/validateBody";

export function diagnosesRoutes(controller: DiagnosesController): Router {
  const router = Router();

  router.post("/diagnoses", validateBody(CreateDiagnosisDTO), controller.create);

  return router;
}
