import { ApplicationError } from "@application/errors/applicationError";
import { IReportRepository } from "@domain/repositories/reportRepository";
import { Result } from "@domain/shared/result";
import { RemoveReportDTO } from "@application/dtos/report/removeReportDto";
import { ReportNotFoundError } from "@application/errors/report/reportNotFoundError";
import { IHashService } from "@domain/services/hashService";
import { InvalidCredentialsError } from "@application/errors/user/invalidCredentialsError";

export class RemoveReport {
  constructor(
    private readonly reportRepository: IReportRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(dto: RemoveReportDTO): Promise<Result<void, ApplicationError>> {
    const report = await this.reportRepository.findById(dto.reportId);

    if (!report) {
      return Result.fail<void>(new ReportNotFoundError(dto.reportId));
    }

    const isPasswordValid = await this.hashService.compare(dto.password, report.pedagogue.password);

    if (!isPasswordValid) {
      return Result.fail<void>(new InvalidCredentialsError());
    }

    await this.reportRepository.remove(dto.reportId);

    return Result.ok<void>();
  }
}
