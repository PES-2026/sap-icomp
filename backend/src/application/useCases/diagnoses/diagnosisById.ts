import { DiagnosisByIdDTO } from "@application/dtos/diagnoses/diagnosisByIdDto";
import { ApplicationError } from "@application/errors/applicationError";
import { DiagnosisNotFoundError } from "@application/errors/diagnoses/diagnosisNotFoundError";
import { DiagnosisResult } from "@domain/repositories/results/diagnosisResult";
import { IDiagnosesRepository } from "@domain/repositories/diagnosesRepository";
import { Result } from "@domain/shared/result";

export class DiagnosisById {
  constructor(private readonly repository: IDiagnosesRepository) {}

  async execute(dto: DiagnosisByIdDTO): Promise<Result<DiagnosisResult, ApplicationError>> {
    const diagnosis = await this.repository.findById(dto.id);

    if (!diagnosis) {
      return Result.fail<DiagnosisResult>(new DiagnosisNotFoundError(dto.id));
    }

    return Result.ok<DiagnosisResult>(diagnosis);
  }
}
