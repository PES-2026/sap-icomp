import { RemoveReportDTO } from "@application/dtos/report/removeReportDto";
import { ApplicationError } from "@application/errors/applicationError";
import { ReportNotFoundError } from "@application/errors/report/reportNotFoundError";
import { InvalidCredentialsError } from "@application/errors/user/invalidCredentialsError";
import { IReportRepository } from "@domain/repositories/reportRepository";
import { IHashService } from "@domain/services/hashService";
import { Result } from "@domain/shared/result";

export class RemoveReport {
  constructor(
    private readonly reportRepository: IReportRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(dto: RemoveReportDTO): Promise<Result<void, ApplicationError>> {
    const reportExists = await this.reportRepository.existsById(dto.reportId);

    if (!reportExists) {
      return Result.fail<void>(new ReportNotFoundError(dto.reportId));
    }
    const pedagoguePassword = await this.reportRepository.findPedagoguePasswordByReportId(dto.reportId);

    if (!pedagoguePassword) {
      return Result.fail<void>(new ReportNotFoundError(dto.reportId));
    }
    //compare the provided password with the pedagogue's password
    const isPasswordValid = await this.hashService.compare(dto.password, pedagoguePassword);

    if (!isPasswordValid) {
      return Result.fail<void>(new InvalidCredentialsError());
    }

    await this.reportRepository.remove(dto.reportId);

    return Result.ok<void>();
  }
}
