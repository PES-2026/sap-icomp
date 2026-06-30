import { ListReportItemDTO } from "@application/dtos/report/listReportDto";
import { ApplicationError } from "@application/errors/applicationError";
import { IReportRepository } from "@domain/repositories/reportRepository";
import { Result } from "@domain/shared/result";

export class ListReportsByStudent {
  constructor(private readonly reportRepository: IReportRepository) {}

  async execute(studentId: string): Promise<Result<ListReportItemDTO[], ApplicationError>> {
    const reports = await this.reportRepository.findByStudentId(studentId);

    return Result.ok<ListReportItemDTO[]>(reports);
  }
}
