import { ApplicationError } from "@application/errors/applicationError";
import { DiagnosisAcronymAlreadyExistsError } from "@application/errors/diagnoses/diagnosisAcronymAlreadyExistsError";
import { DiagnosisCidAlreadyExistsError } from "@application/errors/diagnoses/diagnosisCidAlreadyExistsError";
import { DiagnosisNameAlreadyExistsError } from "@application/errors/diagnoses/diagnosisNameAlreadyExistsError";
import { DiagnosisNotFoundError } from "@application/errors/diagnoses/diagnosisNotFoundError";
import { Diagnosis, DiagnosisPropsVO } from "@domain/entities/diagnosis";
import { DomainError } from "@domain/errors/domainError";
import { IDiagnosesRepository } from "@domain/repositories/diagnosesRepository";
import { Result } from "@domain/shared/result";
import { AcronymVO } from "@domain/valueObjects/diagnoses/acronym";
import { CidVO } from "@domain/valueObjects/diagnoses/cid";
import { NameVO } from "@domain/valueObjects/shared/name";

import { UpdateDiagnosisDTO, UpdateDiagnosisResponse } from "../../dtos/diagnoses/updateDiagnosisDto";

export class UpdateDiagnosis {
  constructor(private repository: IDiagnosesRepository) {}

  async execute(dto: UpdateDiagnosisDTO): Promise<Result<UpdateDiagnosisResponse, ApplicationError | DomainError>> {
    const diagnosis = await this.repository.findById(dto.id);

    if (!diagnosis) {
      return Result.fail<UpdateDiagnosisResponse>(new DiagnosisNotFoundError(dto.id));
    }

    const diagnosisEntity = Diagnosis.rehydrate({
      id: diagnosis.id,
      name: diagnosis.name,
      acronym: diagnosis.acronym,
      cid: diagnosis.cid,
    });

    const propsToUpdate: Partial<DiagnosisPropsVO> = {};

    if (dto.name && dto.name !== diagnosisEntity.name.value) {
      const nameExists = await this.repository.findByName(dto.name);
      if (nameExists && nameExists.id !== diagnosisEntity.diagnosisId.value) {
        return Result.fail<UpdateDiagnosisResponse>(new DiagnosisNameAlreadyExistsError(dto.name));
      }
      const nameResult = NameVO.create(dto.name);
      if (nameResult.isFailure) return Result.fail<UpdateDiagnosisResponse>(nameResult.error!);
      propsToUpdate.name = nameResult.getValue();
    }

    if (dto.acronym !== undefined && dto.acronym !== diagnosisEntity.acronym?.value) {
      const acronymExists = await this.repository.findByAcronym(dto.acronym);
      if (acronymExists && acronymExists.id !== diagnosisEntity.diagnosisId.value) {
        return Result.fail<UpdateDiagnosisResponse>(new DiagnosisAcronymAlreadyExistsError(dto.acronym));
      }
      const acronymResult = AcronymVO.create(dto.acronym);
      if (acronymResult.isFailure) return Result.fail<UpdateDiagnosisResponse>(acronymResult.error!);
      propsToUpdate.acronym = acronymResult.getValue();
    }

    if (dto.cid !== undefined && dto.cid !== diagnosisEntity.cid?.value) {
      const cidExists = await this.repository.findByCid(dto.cid);
      if (cidExists && cidExists.id !== diagnosisEntity.diagnosisId.value) {
        return Result.fail<UpdateDiagnosisResponse>(new DiagnosisCidAlreadyExistsError(dto.cid));
      }
      const cidResult = CidVO.create(dto.cid);
      if (cidResult.isFailure) return Result.fail<UpdateDiagnosisResponse>(cidResult.error!);
      propsToUpdate.cid = cidResult.getValue();
    }

    diagnosisEntity.update(propsToUpdate);

    await this.repository.update(diagnosisEntity);

    return Result.ok<UpdateDiagnosisResponse>({
      id: diagnosisEntity.diagnosisId.value,
      name: diagnosisEntity.name.value,
      acronym: diagnosisEntity.acronym?.value ?? "",
      cid: diagnosisEntity.cid?.value ?? "",
    });
  }
}
