import { ApplicationError } from "@application/errors/applicationError";
import { IReportRepository } from "@domain/repositories/reportRepository";
import { Result } from "@domain/shared/result";
import { GetReportByIdResponseDTO } from "@application/dtos/report/getReportByIdDto";
import { ReportTransformerService } from "@domain/services/reportTransformerService";
import { StudentNotFoundError } from "@application/errors/student/studentNotFoundError";

export class GetReportById {
  constructor(private readonly reportRepository: IReportRepository) {}

  async execute(reportId: string): Promise<Result<GetReportByIdResponseDTO, ApplicationError>> {
    const reportData = await this.reportRepository.findById(reportId);

    if (!reportData) {
      return Result.fail<GetReportByIdResponseDTO>(new StudentNotFoundError());
    }

    const studentInformation = ReportTransformerService.transformStudentInformation(
      reportData.student.name,
      reportData.student.enrollmentId,
      reportData.student.courseName,
    );

    return Result.ok<GetReportByIdResponseDTO>({
      studentInformation,
      pedagogueName: reportData.pedagogueName,
      condition: reportData.condition,
      potential: reportData.potential,
      difficulties: reportData.difficulties,
      recommendation: reportData.recommendation,
      conclusion: reportData.conclusion,
      createdAt: reportData.createdAt,
      updatedAt: reportData.updatedAt,
    });
  }
}
