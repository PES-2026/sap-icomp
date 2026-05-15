import {
  CreateTypeAttendanceDTO,
  CreateTypeAttendanceResponse,
} from "@application/dtos/typeAttendance/createTypeAttendanceDto";
import { ApplicationError } from "@application/errors/applicationError";
import { AttendanceTypeAlreadyExistsError } from "@application/errors/attendance/attendanceTypeAlreadyExistsError";
import { TypeAttendance } from "@domain/entities/typeAttendance";
import { DomainError } from "@domain/errors/domainError";
import { ITypeAttendanceRepository } from "@domain/repositories/typeAttendanceRepository";
import { Result } from "@domain/shared/result";

export class CreateTypeAttendance {
  constructor(private readonly repository: ITypeAttendanceRepository) {}

  async execute(
    dto: CreateTypeAttendanceDTO,
  ): Promise<Result<CreateTypeAttendanceResponse, ApplicationError | DomainError>> {
    const nameExists = await this.repository.findByName(dto.name);
    if (nameExists) {
      return Result.fail<CreateTypeAttendanceResponse>(new AttendanceTypeAlreadyExistsError(dto.name));
    }

    const entity = TypeAttendance.create({
      name: dto.name,
    });

    if (entity.isFailure) {
      return Result.fail<CreateTypeAttendanceResponse>(entity.error!);
    }

    await this.repository.save(entity.getValue());

    return Result.ok<CreateTypeAttendanceResponse>({
      id: entity.getValue().externalId.value,
      name: entity.getValue().name.value,
    });
  }
}
