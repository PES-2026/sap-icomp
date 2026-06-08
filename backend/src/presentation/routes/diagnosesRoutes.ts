import { Router } from "express";

import { CreateDiagnosisDTO } from "@application/dtos/diagnoses/createDiagnosisDto";
import { DiagnosisByIdDTO } from "@application/dtos/diagnoses/diagnosisByIdDto";
import { ListDiagnosisDTO } from "@application/dtos/diagnoses/listDiagnosisDto";
import { RemoveDiagnosisDTO } from "@application/dtos/diagnoses/removeDiagnosisDto";
import { UpdateDiagnosisDTO } from "@application/dtos/diagnoses/updateDiagnosisDto";
import { DiagnosesController } from "@presentation/controllers/diagnosesController";
import { validateBody } from "@presentation/middlewares/validateBody";
import { validateParams } from "@presentation/middlewares/validateParams";
import { validateParamsAndBody } from "@presentation/middlewares/validateParamsAndBody";
import { validateQuery } from "@presentation/middlewares/validateQuery";

export function diagnosesRoutes(controller: DiagnosesController): Router {
  const router = Router();

  router.post("/diagnoses", validateBody(CreateDiagnosisDTO), controller.create);
  router.put("/diagnoses/:id", validateParamsAndBody(UpdateDiagnosisDTO), controller.update);
  router.get("/diagnoses", validateQuery(ListDiagnosisDTO), controller.list);
  router.post("/diagnoses/:id/remove", validateParams(RemoveDiagnosisDTO), controller.remove);
  router.get("/diagnoses/:id", validateParams(DiagnosisByIdDTO), controller.getById);

  return router;
}
