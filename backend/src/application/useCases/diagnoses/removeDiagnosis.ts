import { RemoveDiagnosisDTO } from "@application/dtos/diagnoses/removeDiagnosisDto";
import { DiagnosisNotFoundError } from "@application/errors/diagnoses/diagnosisNotFoundError";
import { IDiagnosesRepository } from "@domain/repositories/diagnosesRepository";
import { Result } from "@domain/shared/result";

export class RemoveDiagnosis {
  constructor(private readonly repository: IDiagnosesRepository) {}

  async execute(dto: RemoveDiagnosisDTO): Promise<Result<void, DiagnosisNotFoundError>> {
    const diagnosis = await this.repository.findById(dto.id);

    if (!diagnosis) {
      return Result.fail<void>(new DiagnosisNotFoundError(dto.id));
    }

    await this.repository.remove(dto.id);

    return Result.ok<void>();
  }
}
