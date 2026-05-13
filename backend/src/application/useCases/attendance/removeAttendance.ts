import { Attendance } from "@domain/entities/attendance";
import { IAttendanceRepository } from "@domain/repositories/attendanceRepository";
import { Result } from "@domain/shared/result";
import { AttendanceNotFoundError } from "@application/errors/attendance/attendanceNotFoundError";
import { ApplicationError } from "@application/errors/applicationError";

import { RemoveAttendanceDTO } from "../../dtos/attendance/removeAttendanceDto";

export class RemoveAttendance {
  constructor(private repository: IAttendanceRepository) {}

  async execute(input: RemoveAttendanceDTO): Promise<Result<void, ApplicationError>> {
    const attendance: Attendance | null = await this.repository.findById(input.id);

    if (!attendance) {
      return Result.fail<void>(new AttendanceNotFoundError(input.id));
    }

    attendance.remove();

    await this.repository.remove(input.id);

    return Result.ok<void>();
  }
}
