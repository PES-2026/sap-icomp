import { Router } from "express";

import { CreateDiagnosisDTO } from "@application/dtos/diagnoses/createDiagnosisDto";
import { UpdateDiagnosisDTO } from "@application/dtos/diagnoses/updateDiagnosisDto";
import { DiagnosesController } from "@presentation/controllers/diagnosesController";
import { validateBody } from "@presentation/middlewares/validateBody";
import { validateParams } from "@presentation/middlewares/validateParams";

export function diagnosesRoutes(controller: DiagnosesController): Router {
  const router = Router();

  router.post("/diagnoses", validateBody(CreateDiagnosisDTO), controller.create);
  router.put("/diagnoses/:id", validateParams(UpdateDiagnosisDTO), controller.update);

  return router;
}
