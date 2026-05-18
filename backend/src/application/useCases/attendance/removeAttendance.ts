import { ApplicationError } from "@application/errors/applicationError";
import { AttendanceNotFoundError } from "@application/errors/attendance/attendanceNotFoundError";
import { Attendance } from "@domain/entities/attendance";
import { IAttendanceRepository } from "@domain/repositories/attendanceRepository";
import { AttendanceResult } from "@domain/repositories/results/attendanceResult";
import { Result } from "@domain/shared/result";

import { RemoveAttendanceDTO } from "../../dtos/attendance/removeAttendanceDto";

export class RemoveAttendance {
  constructor(private repository: IAttendanceRepository) {}

  async execute(input: RemoveAttendanceDTO): Promise<Result<void, ApplicationError>> {
    const attendance: AttendanceResult | null = await this.repository.findById(input.id);

    if (!attendance) {
      return Result.fail<void>(new AttendanceNotFoundError(input.id));
    }

    const attendanceEntity = Attendance.rehydrate({
      id: attendance.id!,
      studentId: attendance.student.id,
      typeId: attendance.type.id,
      date: attendance.date,
      demand: attendance.demand,
      generalObservations: attendance.generalObservations,
    });

    attendanceEntity.remove();

    await this.repository.remove(input.id);

    return Result.ok<void>();
  }
}
