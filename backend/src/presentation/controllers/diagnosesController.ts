import { Request, Response } from "express";

import { CreateDiagnosisDTO } from "@application/dtos/diagnoses/createDiagnosisDto";
import { UpdateDiagnosisDTO } from "@application/dtos/diagnoses/updateDiagnosisDto";
import { CreateDiagnosis } from "@application/useCases/diagnoses/createDiagnosis";
import { UpdateDiagnosis } from "@application/useCases/diagnoses/updateDiagnosis";

import { BaseController } from "./baseController";

export class DiagnosesController extends BaseController {
  constructor(
    private createDiagnosis: CreateDiagnosis,
    private updateDiagnosis: UpdateDiagnosis,
  ) {
    super();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = CreateDiagnosisDTO.create(req.body);
      const result = await this.createDiagnosis.execute(dto);

      this.handleResult(res, result, 201);
    } catch (error) {
      this.handleError(error, res, `${DiagnosesController.name}:create`);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = UpdateDiagnosisDTO.create(req.params.id, req.body);
      const result = await this.updateDiagnosis.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${DiagnosesController.name}:update`);
    }
  };
}
