import { Request, Response } from "express";

import { CreateDiagnosisDTO } from "@application/dtos/diagnoses/createDiagnosisDto";
import { DiagnosisByIdDTO } from "@application/dtos/diagnoses/diagnosisByIdDto";
import { ListDiagnosisDTO } from "@application/dtos/diagnoses/listDiagnosisDto";
import { RemoveDiagnosisDTO } from "@application/dtos/diagnoses/removeDiagnosisDto";
import { UpdateDiagnosisDTO } from "@application/dtos/diagnoses/updateDiagnosisDto";
import { CreateDiagnosis } from "@application/useCases/diagnoses/createDiagnosis";
import { DiagnosisById } from "@application/useCases/diagnoses/diagnosisById";
import { ListDiagnoses } from "@application/useCases/diagnoses/listDiagnoses";
import { RemoveDiagnosis } from "@application/useCases/diagnoses/removeDiagnosis";
import { UpdateDiagnosis } from "@application/useCases/diagnoses/updateDiagnosis";

import { BaseController } from "./baseController";

export class DiagnosesController extends BaseController {
  constructor(
    private createDiagnosis: CreateDiagnosis,
    private updateDiagnosis: UpdateDiagnosis,
    private listDiagnoses: ListDiagnoses,
    private removeDiagnosis: RemoveDiagnosis,
    private diagnosisById: DiagnosisById,
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

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = ListDiagnosisDTO.create(req.query);
      const result = await this.listDiagnoses.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${DiagnosesController.name}:list`);
    }
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = RemoveDiagnosisDTO.create(req.params.id);
      const result = await this.removeDiagnosis.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${DiagnosesController.name}:remove`);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = DiagnosisByIdDTO.create(req.params.id);
      const result = await this.diagnosisById.execute(dto);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${DiagnosesController.name}:getById`);
    }
  };
}
