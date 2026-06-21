import { ApplicationError } from "@application/errors/applicationError";
import { CreateReportDTO } from "@application/dtos/report/createReportDto";
import { Report } from "@domain/entities/report";
import { IReportRepository } from "@domain/repositories/reportRepository";
import { Result } from "@domain/shared/result";
import { StudentNotFoundError } from "@application/errors/student/studentNotFoundError";
import { GetReportByIdResponseDTO } from "@application/dtos/report/getReportByIdDto";
import { ReportTransformerService } from "@domain/services/reportTransformerService";

export class UpdateReport {
  constructor(private readonly reportRepository: IReportRepository) {}

  async execute(
    reportId: string,
    dto: CreateReportDTO,
  ): Promise<Result<GetReportByIdResponseDTO, ApplicationError>> {
    const reportData = await this.reportRepository.findById(reportId);

    if (!reportData) {
      return Result.fail<GetReportByIdResponseDTO>(new StudentNotFoundError()); // Should be ReportNotFoundError
    }

    const report = Report.rehydrate({
      id: reportId,
      studentId: reportData.student.externalId,
      pedagogueId: reportData.pedagogueId,
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
      return Result.fail<GetReportByIdResponseDTO>(updateResult.error as ApplicationError);
    }

    await this.reportRepository.update(report);

    const studentInformation = ReportTransformerService.transformStudentInformation(
      reportData.student.name,
      reportData.student.enrollmentId,
      reportData.student.courseName,
    );

    return Result.ok<GetReportByIdResponseDTO>({
      studentInformation,
      pedagogueName: reportData.pedagogueName,
      condition: report.condition.value,
      potential: report.potential.value,
      difficulties: report.difficulties.value,
      recommendation: report.recommendation.value,
      conclusion: report.conclusion.value,
      createdAt: report.createdAt!,
      updatedAt: report.updatedAt!,
    });
  }
}
