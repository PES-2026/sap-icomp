import { ApplicationError } from "@application/errors/applicationError";
import { IReportRepository } from "@domain/repositories/reportRepository";
import { Result } from "@domain/shared/result";
import { ListReportItemDTO } from "@application/dtos/report/listReportDto";
import { RequiredFieldError } from "@domain/errors/requiredFieldError";

export class ListReportsByStudent {
  constructor(private readonly reportRepository: IReportRepository) {}

  async execute(studentId: any): Promise<Result<ListReportItemDTO[], ApplicationError>> {
    if (!studentId || typeof studentId !== "string" || studentId.trim() === "") {
      return Result.fail<ListReportItemDTO[]>(new RequiredFieldError("studentId"));
    }
    const reports = await this.reportRepository.findByStudentId(studentId);

    return Result.ok<ListReportItemDTO[]>(reports);
  }
}
