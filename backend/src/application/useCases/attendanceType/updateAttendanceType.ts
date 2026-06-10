import {
  UpdateAttendanceTypeDTO,
  UpdateAttendanceTypeResponse,
} from "@application/dtos/attendanceType/updateAttendanceTypeDto";
import { ApplicationError } from "@application/errors/applicationError";
import { AttendanceTypeNotFoundError } from "@application/errors/attendance/attendanceTypeNotFoundError";
import { AttendanceTypeNameAlreadyExistsError } from "@application/errors/attendanceType/attendanceTypeNameAlreadyExists";
import { AttendanceType, AttendanceTypeVOProps } from "@domain/entities/attendanceType";
import { DomainError } from "@domain/errors/domainError";
import { IAttendanceTypeRepository } from "@domain/repositories/attendanceTypeRepository";
import { Result } from "@domain/shared/result";
import { NameVO } from "@domain/valueObjects/shared/name";

export class UpdateAttendanceType {
  constructor(private readonly repository: IAttendanceTypeRepository) {}

  async execute(
    dto: UpdateAttendanceTypeDTO,
  ): Promise<Result<UpdateAttendanceTypeResponse, ApplicationError | DomainError>> {
    const exists = await this.repository.findById(dto.id);
    if (!exists) {
      return Result.fail<UpdateAttendanceTypeResponse>(new AttendanceTypeNotFoundError(dto.id));
    }

    const entity = AttendanceType.rehydrate({
      id: exists.id,
      name: exists.name,
    });

    if (dto.name && dto.name !== entity.name.value) {
      const nameExists = await this.repository.findByName(dto.name);
      if (nameExists) {
        return Result.fail<UpdateAttendanceTypeResponse>(new AttendanceTypeNameAlreadyExistsError(dto.name));
      }
    }

    const props: Partial<AttendanceTypeVOProps> = {};

    if (dto.name !== undefined) {
      const result = NameVO.create(dto.name);
      if (result.isFailure) return Result.fail<UpdateAttendanceTypeResponse>(result.error!);
      props.name = result.getValue();
    }

    entity.update(props);

    await this.repository.update(entity);

    return Result.ok<UpdateAttendanceTypeResponse>({
      id: entity.externalId.value,
      name: entity.name.value,
    });
  }
}
