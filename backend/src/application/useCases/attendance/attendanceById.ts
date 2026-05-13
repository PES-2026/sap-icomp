import { ApplicationError } from "@application/errors/applicationError";
import { AttendanceNotFoundError } from "@application/errors/attendance/attendanceNotFoundError";
import { IAttendanceRepository } from "@domain/repositories/attendanceRepository";
import { AttendanceResult } from "@domain/repositories/results/attendanceResult";
import { Result } from "@domain/shared/result";

import { AttendanceByIdDTO } from "../../dtos/attendance/attendanceByIdDto";

export class AttendanceById {
  constructor(private repository: IAttendanceRepository) {}

  async execute(input: AttendanceByIdDTO): Promise<Result<AttendanceResult, ApplicationError>> {
    const attendance: AttendanceResult | null = await this.repository.findById(input.id);

    if (!attendance) {
      return Result.fail<AttendanceResult>(new AttendanceNotFoundError(input.id));
    }

    return Result.ok<AttendanceResult>(attendance);
  }
}
