import { RemoveTypeAttendanceDTO } from "@application/dtos/typeAttendance/removeTypeAttendanceDto";
import { ApplicationError } from "@application/errors/applicationError";
import { AttendanceTypeNotFoundError } from "@application/errors/attendance/attendanceTypeNotFoundError";
import { DomainError } from "@domain/errors/domainError";
import { ITypeAttendanceRepository } from "@domain/repositories/typeAttendanceRepository";
import { Result } from "@domain/shared/result";

export class RemoveTypeAttendance {
  constructor(private readonly repository: ITypeAttendanceRepository) {}

  async execute(dto: RemoveTypeAttendanceDTO): Promise<Result<void, ApplicationError | DomainError>> {
    const exists = await this.repository.findById(dto.id);
    if (!exists) {
      return Result.fail<void>(new AttendanceTypeNotFoundError(dto.id));
    }

    await this.repository.remove(dto.id);

    return Result.ok<void>();
  }
}
