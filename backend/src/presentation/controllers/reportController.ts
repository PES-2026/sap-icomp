import { Request, Response } from "express";

import { GetReportInitialData } from "@application/useCases/report/getReportInitialData";
import { CreateReport } from "@application/useCases/report/createReport";
import { UpdateReport } from "@application/useCases/report/updateReport";
import { ListReportsByStudent } from "@application/useCases/report/listReportsByStudent";
import { GetReportById } from "@application/useCases/report/getReportById";
import { CreateReportDTO } from "@application/dtos/report/createReportDto";
import { BaseController } from "./baseController";

export class ReportController extends BaseController {
  constructor(
    private readonly getReportInitialDataUseCase: GetReportInitialData,
    private readonly createReportUseCase: CreateReport,
    private readonly updateReportUseCase: UpdateReport,
    private readonly listReportsByStudentUseCase: ListReportsByStudent,
    private readonly getReportByIdUseCase: GetReportById,
  ) {
    super();
  }

  getInitialData = async (req: Request, res: Response): Promise<void> => {
    try {
      const { studentId } = req.params;
      const result = await this.getReportInitialDataUseCase.execute(studentId);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ReportController.name}:getInitialData`);
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { studentId } = req.params;
      const pedagogueId = req.userId;

      if (!pedagogueId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const dtoResult = CreateReportDTO.create(req.body);
      if (dtoResult.isFailure) {
        this.clientError(res, dtoResult.error?.message);
        return;
      }

      const result = await this.createReportUseCase.execute(
        studentId,
        pedagogueId,
        dtoResult.getValue(),
      );

      this.handleResult(res, result, 201);
    } catch (error) {
      this.handleError(error, res, `${ReportController.name}:create`);
    }
  };

  edit = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reportId } = req.params;

      const dtoResult = CreateReportDTO.create(req.body);
      if (dtoResult.isFailure) {
        this.clientError(res, dtoResult.error?.message);
        return;
      }

      const result = await this.updateReportUseCase.execute(
        reportId,
        dtoResult.getValue(),
      );

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ReportController.name}:edit`);
    }
  };

  listByStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { studentId } = req.params;
      const result = await this.listReportsByStudentUseCase.execute(studentId);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ReportController.name}:listByStudent`);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { reportId } = req.params;
      const result = await this.getReportByIdUseCase.execute(reportId);

      this.handleResult(res, result);
    } catch (error) {
      this.handleError(error, res, `${ReportController.name}:getById`);
    }
  };
}
