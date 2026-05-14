import { CreateDiagnosisDTO, CreateDiagnosisResponse } from "@application/dtos/diagnoses/createDiagnosisDto";
import { ApplicationError } from "@application/errors/applicationError";
import { Diagnosis } from "@domain/entities/diagnosis";
import { DomainError } from "@domain/errors/domainError";
import { IDiagnosesRepository } from "@domain/repositories/diagnosesRepository";
import { Result } from "@domain/shared/result";

export class CreateDiagnosis {
  constructor(private repository: IDiagnosesRepository) {}

  async execute(dto: CreateDiagnosisDTO): Promise<Result<CreateDiagnosisResponse, ApplicationError | DomainError>> {
    const diagnosisEntity = Diagnosis.create({
      name: dto.name,
      acronym: dto.acronym ?? "",
      cid: dto.cid ?? "",
    });

    if (diagnosisEntity.isFailure) {
      return Result.fail<CreateDiagnosisResponse>(diagnosisEntity.error!);
    }

    await this.repository.save(diagnosisEntity.getValue());

    return Result.ok<CreateDiagnosisResponse>({
      id: diagnosisEntity.getValue().diagnosisId.value,
      name: diagnosisEntity.getValue().name.value,
      acronym: diagnosisEntity.getValue().acronym?.value ?? "",
      cid: diagnosisEntity.getValue().cid?.value ?? "",
    });
  }
}
