import { Request, Response } from "express";

import { CreateDiagnosisDTO } from "@application/dtos/diagnoses/createDiagnosisDto";
import { CreateDiagnosis } from "@application/useCases/diagnoses/createDiagnosis";

import { BaseController } from "./baseController";

export class DiagnosesController extends BaseController {
  constructor(private createDiagnosis: CreateDiagnosis) {
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
}
