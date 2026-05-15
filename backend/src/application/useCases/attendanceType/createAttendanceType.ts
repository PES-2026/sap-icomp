import {
  CreateAttendanceTypeDTO,
  CreateAttendanceTypeResponse,
} from "@application/dtos/attendanceType/createAttendanceTypeDto";
import { ApplicationError } from "@application/errors/applicationError";
import { AttendanceTypeNameAlreadyExistsError } from "@application/errors/attendanceType/attendanceTypeNameAlreadyExists";
import { AttendanceType } from "@domain/entities/attendanceType";
import { DomainError } from "@domain/errors/domainError";
import { IAttendanceTypeRepository } from "@domain/repositories/attendanceTypeRepository";
import { Result } from "@domain/shared/result";

export class CreateAttendanceType {
  constructor(private readonly repository: IAttendanceTypeRepository) {}

  async execute(
    dto: CreateAttendanceTypeDTO,
  ): Promise<Result<CreateAttendanceTypeResponse, ApplicationError | DomainError>> {
    const nameExists = await this.repository.findByName(dto.name);
    if (nameExists) {
      return Result.fail<CreateAttendanceTypeResponse>(new AttendanceTypeNameAlreadyExistsError(dto.name));
    }

    const entity = AttendanceType.create({
      name: dto.name,
    });

    if (entity.isFailure) {
      return Result.fail<CreateAttendanceTypeResponse>(entity.error!);
    }

    await this.repository.save(entity.getValue());

    return Result.ok<CreateAttendanceTypeResponse>({
      id: entity.getValue().externalId.value,
      name: entity.getValue().name.value,
    });
  }
}
