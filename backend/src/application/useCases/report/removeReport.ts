import { ApplicationError } from "@application/errors/applicationError";
import { IReportRepository } from "@domain/repositories/reportRepository";
import { Result } from "@domain/shared/result";
import { RemoveReportDTO } from "@application/dtos/report/removeReportDto";
import { ReportNotFoundError } from "@application/errors/report/reportNotFoundError";

export class RemoveReport {
  constructor(private readonly reportRepository: IReportRepository) {}

  async execute(dto: RemoveReportDTO): Promise<Result<void, ApplicationError>> {
    const report = await this.reportRepository.findById(dto.reportId);

    if (!report) {
      return Result.fail<void>(new ReportNotFoundError(dto.reportId));
    }

    await this.reportRepository.remove(dto.reportId);

    return Result.ok<void>();
  }
}
