import { UpdateReportDTO } from "@application/dtos/report/updateReportDto";
import { ApplicationError } from "@application/errors/applicationError";
import { ReportNotFoundError } from "@application/errors/report/reportNotFoundError";
import { ReportOwnershipError } from "@application/errors/report/reportOwnershipError";
import { Report } from "@domain/entities/report";
import { IReportRepository } from "@domain/repositories/reportRepository";
import { Result } from "@domain/shared/result";

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
    if (reportData.pedagogue.externalId !== dto.userId) {
      return Result.fail<void>(new ReportOwnershipError("userId"));
    } // this test is a security layer, indicate a potential security issue if the userId does not match the pedagogue's externalId
    //it's necessary applycate others actions to registre this issue, like log this event, send an alert to the system administrator, or even block the user account until the issue is resolved.
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
