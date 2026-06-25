import { ApplicationError } from "@application/errors/applicationError";
import { UpdateReportDTO } from "@application/dtos/report/updateReportDto";
import { Report } from "@domain/entities/report";
import { IReportRepository } from "@domain/repositories/reportRepository";
import { Result } from "@domain/shared/result";
import { ReportNotFoundError } from "@application/errors/report/reportNotFoundError";
import { ReportOwnershipError } from "@application/errors/report/reportOwnershipError";

export class UpdateReport {
  constructor(private readonly reportRepository: IReportRepository) {}

  async execute(dto: UpdateReportDTO): Promise<Result<void, ApplicationError>> {
    const reportData = await this.reportRepository.findByIdWithDetails(dto.reportId);

    if (!reportData) {
      return Result.fail<void>(new ReportNotFoundError(dto.reportId));
    }

    if (reportData.student.externalId !== dto.studentId) {
      return Result.fail<void>(new ReportOwnershipError("student"));
    }

    if (reportData.pedagogue.externalId !== dto.pedagogueId) {
      return Result.fail<void>(new ReportOwnershipError("pedagogue"));
    }

    const report = Report.rehydrate({
      id: reportData.reportExternalId,
      studentId: reportData.student.externalId,
      pedagogueId: reportData.pedagogue.externalId,
      ...reportData,
    });

    const updateResult = report.update(
      dto.condition,
      dto.potential,
      dto.difficulties,
      dto.recommendation,
      dto.conclusion,
    );

    if (updateResult.isFailure) {
      return Result.fail<void>(updateResult.error as ApplicationError);
    }

    await this.reportRepository.update(report);

    return Result.ok<void>();
  }
}
