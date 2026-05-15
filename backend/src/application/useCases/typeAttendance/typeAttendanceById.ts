import { TypeAttendanceByIdDTO } from "@application/dtos/typeAttendance/typeAttendanceByIdDto";
import { ApplicationError } from "@application/errors/applicationError";
import { AttendanceTypeNotFoundError } from "@application/errors/attendance/attendanceTypeNotFoundError";
import { TypeAttendanceResult } from "@domain/repositories/results/typeAttendanceResult";
import { ITypeAttendanceRepository } from "@domain/repositories/typeAttendanceRepository";
import { Result } from "@domain/shared/result";

export class TypeAttendanceById {
  constructor(private readonly repository: ITypeAttendanceRepository) {}

  async execute(dto: TypeAttendanceByIdDTO): Promise<Result<TypeAttendanceResult, ApplicationError>> {
    const result = await this.repository.findById(dto.id);
    if (!result) {
      return Result.fail<TypeAttendanceResult>(new AttendanceTypeNotFoundError(dto.id));
    }

    return Result.ok<TypeAttendanceResult>(result);
  }
}
