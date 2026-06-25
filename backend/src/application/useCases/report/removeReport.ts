import { ApplicationError } from "@application/errors/applicationError";
import { IReportRepository } from "@domain/repositories/reportRepository";
import { Result } from "@domain/shared/result";
import { StudentNotFoundError } from "@application/errors/student/studentNotFoundError";
import { RemoveReportDTO } from "@application/dtos/report/removeReportDto";

export class RemoveReport {
  constructor(private readonly reportRepository: IReportRepository) {}

  async execute(dto: RemoveReportDTO): Promise<Result<void, ApplicationError>> {
    const report = await this.reportRepository.findById(dto.reportId);

    if (!report) {
      return Result.fail<void>(new StudentNotFoundError()); // Should be ReportNotFoundError
    }

    await this.reportRepository.remove(dto.reportId);

    return Result.ok<void>();
  }
}
