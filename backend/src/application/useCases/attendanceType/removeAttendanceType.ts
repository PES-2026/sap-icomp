import { RemoveAttendanceTypeDTO } from "@application/dtos/attendanceType/removeAttendanceTypeDto";
import { ApplicationError } from "@application/errors/applicationError";
import { AttendanceTypeNotFoundError } from "@application/errors/attendance/attendanceTypeNotFoundError";
import { DomainError } from "@domain/errors/domainError";
import { IAttendanceTypeRepository } from "@domain/repositories/attendanceTypeRepository";
import { Result } from "@domain/shared/result";

export class RemoveAttendanceType {
  constructor(private readonly repository: IAttendanceTypeRepository) {}

  async execute(dto: RemoveAttendanceTypeDTO): Promise<Result<void, ApplicationError | DomainError>> {
    const exists = await this.repository.findById(dto.id);
    if (!exists) {
      return Result.fail<void>(new AttendanceTypeNotFoundError(dto.id));
    }

    await this.repository.remove(dto.id);

    return Result.ok<void>();
  }
}
