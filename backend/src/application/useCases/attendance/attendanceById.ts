import { Attendance } from "@domain/entities/attendance";
import { IAttendanceRepository } from "@domain/repositories/attendanceRepository";
import { Result } from "@domain/shared/result";
import { AttendanceNotFoundError } from "@application/errors/attendance/attendanceNotFoundError";

import { AttendanceByIdDTO, AttendanceByIdResponse } from "../../dtos/attendance/attendanceByIdDto";
import { ApplicationError } from "@application/errors/applicationError";

export class AttendanceById {
  constructor(private repository: IAttendanceRepository) {}

  async execute(input: AttendanceByIdDTO): Promise<Result<AttendanceByIdResponse, ApplicationError>> {
    const attendance: Attendance | null = await this.repository.findById(input.id);

    if (!attendance) {
      return Result.fail<AttendanceByIdResponse>(new AttendanceNotFoundError(input.id));
    }

    return Result.ok<AttendanceByIdResponse>({
      id: attendance.id.value,
      studentId: attendance.studentId.value,
      type: attendance.type.value,
      date: attendance.date.value,
      demand: attendance.demand.value,
      generalObservations: attendance.generalObservations?.value ?? "",
    });
  }
}
