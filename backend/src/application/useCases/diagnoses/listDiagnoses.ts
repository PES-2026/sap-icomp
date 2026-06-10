import { ListDiagnosisDTO } from "@application/dtos/diagnoses/listDiagnosisDto";
import { ApplicationError } from "@application/errors/applicationError";
import { IDiagnosesRepository } from "@domain/repositories/diagnosesRepository";
import { DiagnosisListParams } from "@domain/repositories/filters/diagnosisFilters";
import { PaginatedDiagnosisResult } from "@domain/repositories/results/diagnosisResult";
import { Result } from "@domain/shared/result";

export class ListDiagnoses {
  constructor(private readonly repository: IDiagnosesRepository) {}

  async execute(dto: ListDiagnosisDTO): Promise<Result<PaginatedDiagnosisResult, ApplicationError>> {
    const params: DiagnosisListParams = {
      page: dto.page,
      limit: dto.limit,
      filters: dto.filters,
    };

    const result = await this.repository.findAll(params);

    return Result.ok<PaginatedDiagnosisResult>(result);
  }
}
