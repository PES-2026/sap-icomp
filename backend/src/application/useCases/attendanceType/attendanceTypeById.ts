import { AttendanceTypeByIdDTO } from "@application/dtos/attendanceType/attendanceTypeByIdDto";
import { ApplicationError } from "@application/errors/applicationError";
import { AttendanceTypeNotFoundError } from "@application/errors/attendance/attendanceTypeNotFoundError";
import { IAttendanceTypeRepository } from "@domain/repositories/attendanceTypeRepository";
import { AttendanceTypeResult } from "@domain/repositories/results/attendanceTypeResult";
import { Result } from "@domain/shared/result";

export class AttendanceTypeById {
  constructor(private readonly repository: IAttendanceTypeRepository) {}

  async execute(dto: AttendanceTypeByIdDTO): Promise<Result<AttendanceTypeResult, ApplicationError>> {
    const result = await this.repository.findById(dto.id);
    if (!result) {
      return Result.fail<AttendanceTypeResult>(new AttendanceTypeNotFoundError(dto.id));
    }

    return Result.ok<AttendanceTypeResult>(result);
  }
}
