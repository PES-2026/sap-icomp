import { Request, Response } from "express";

import { GetReportInitialData } from "@application/useCases/report/getReportInitialData";
import { CreateReport } from "@application/useCases/report/createReport";
import { UpdateReport } from "@application/useCases/report/updateReport";
import { RemoveReport } from "@application/useCases/report/removeReport";
import { ListReportsByStudent } from "@application/useCases/report/listReportsByStudent";
import { GetReportById } from "@application/useCases/report/getReportById";
import { CreateReportDTO } from "@application/dtos/report/createReportDto";
import { UpdateReportDTO } from "@application/dtos/report/updateReportDto";
import { ListReportsByStudentDTO } from "@application/dtos/report/listReportsByStudentDto";
import { RemoveReportDTO } from "@application/dtos/report/removeReportDto";
import { GetReportByIdDTO } from "@application/dtos/report/getReportByIdDto";
import { GetInitialDataDTO } from "@application/dtos/report/getInitialDataDto";
import { BaseController } from "./baseController";

export class ReportController extends BaseController {
  constructor(
    private readonly getReportInitialDataUseCase: GetReportInitialData,
    private readonly createReportUseCase: CreateReport,
    private readonly updateReportUseCase: UpdateReport,
    private readonly removeReportUseCase: RemoveReport,
    private readonly listReportsByStudentUseCase: ListReportsByStudent,
    private readonly getReportByIdUseCase: GetReportById,
  ) {
    super();
  }

  getInitialData = async (req: Request, res: Response): Promise<void> => {
    try {
      const { studentId } = req.query;
      const dtoResult = GetInitialDataDTO.create(studentId);

      const result = await this.getReportInitialDataUseCase.execute(dtoResult.getValue());

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ReportController.name}:getInitialData`);
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { studentId } = req.body;
      const dtoResult = CreateReportDTO.create(studentId, req.body);

      const result = await this.createReportUseCase.execute(dtoResult.getValue());

      this.handleResult(res, result, 201);
    } catch (error) {
      this.handleError(error, res, `${ReportController.name}:create`);
    }
  };

  edit = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reportId } = req.params;

      const dtoResult = UpdateReportDTO.create(reportId, req.body);

      const result = await this.updateReportUseCase.execute(dtoResult.getValue());

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ReportController.name}:edit`);
    }
  };

  listByStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const dtoResult = ListReportsByStudentDTO.create(req.params);

      const result = await this.listReportsByStudentUseCase.execute(dtoResult.getValue().studentId);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ReportController.name}:listByStudent`);
    }
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reportId } = req.params;
      const dtoResult = RemoveReportDTO.create(reportId);

      const result = await this.removeReportUseCase.execute(dtoResult.getValue());

      this.handleResult(res, result, 204);
    } catch (error) {
      this.handleError(error, res, `${ReportController.name}:remove`);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reportId } = req.params;
      const dtoResult = GetReportByIdDTO.create(reportId);

      const result = await this.getReportByIdUseCase.execute(dtoResult.getValue());

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ReportController.name}:getById`);
    }
  };
}
