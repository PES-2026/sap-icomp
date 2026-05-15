import {
  UpdateTypeAttendanceDTO,
  UpdateTypeAttendanceResponse,
} from "@application/dtos/typeAttendance/updateTypeAttendanceDto";
import { ApplicationError } from "@application/errors/applicationError";
import { AttendanceTypeAlreadyExistsError } from "@application/errors/attendance/attendanceTypeAlreadyExistsError";
import { AttendanceTypeNotFoundError } from "@application/errors/attendance/attendanceTypeNotFoundError";
import { TypeAttendance, TypeAttendanceVOProps } from "@domain/entities/typeAttendance";
import { DomainError } from "@domain/errors/domainError";
import { ITypeAttendanceRepository } from "@domain/repositories/typeAttendanceRepository";
import { Result } from "@domain/shared/result";
import { TypeAttendanceNameVO } from "@domain/valueObjects/typeAttendance/typeAttendanceName";

export class UpdateTypeAttendance {
  constructor(private readonly repository: ITypeAttendanceRepository) {}

  async execute(
    dto: UpdateTypeAttendanceDTO,
  ): Promise<Result<UpdateTypeAttendanceResponse, ApplicationError | DomainError>> {
    const exists = await this.repository.findById(dto.id);
    if (!exists) {
      return Result.fail<UpdateTypeAttendanceResponse>(new AttendanceTypeNotFoundError(dto.id));
    }

    const entity = TypeAttendance.rehydrate({
      id: exists.id,
      name: exists.name,
    });

    if (dto.name && dto.name !== entity.name.value) {
      const nameExists = await this.repository.findByName(dto.name);
      if (nameExists) {
        return Result.fail<UpdateTypeAttendanceResponse>(new AttendanceTypeAlreadyExistsError(dto.name));
      }
    }

    const props: Partial<TypeAttendanceVOProps> = {};

    if (dto.name !== undefined) {
      const result = TypeAttendanceNameVO.create(dto.name);
      if (result.isFailure) return Result.fail<UpdateTypeAttendanceResponse>(result.error!);
      props.name = result.getValue();
    }

    entity.update(props);

    await this.repository.update(entity);

    return Result.ok<UpdateTypeAttendanceResponse>({
      id: entity.externalId.value,
      name: entity.name.value,
    });
  }
}
