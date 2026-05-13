import { IAttendanceRepository, AttendancesByStudentRequest } from "@domain/repositories/attendanceRepository";
import { Result } from "@domain/shared/result";
import { AttendancesNotFoundError } from "@application/errors/attendance/attendancesNotFoundError";

import { AttendancesByStudentDTO, AttendancesByStudentResponse } from "../../dtos/attendance/attendancesByStudentDto";
import { ApplicationError } from "@application/errors/applicationError";

export class AttendancesByStudent {
  constructor(private repository: IAttendanceRepository) {}

  async execute(dto: AttendancesByStudentDTO): Promise<Result<AttendancesByStudentResponse, ApplicationError>> {
    const params: AttendancesByStudentRequest = {
      page: dto.page,
      limit: dto.limit,
      studentId: dto.studentId,
    };

    const result = await this.repository.findByStudentId(params);

    if (!result) {
      return Result.fail<AttendancesByStudentResponse>(new AttendancesNotFoundError(dto.studentId));
    }

    return Result.ok<AttendancesByStudentResponse>({
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      items: result.items.map((item) => ({
        id: item.id,
        studentId: item.studentId,
        studentName: item.studentName,
        enrollmentId: item.enrollmentId,
        course: item.course,
        attendanceType: item.attendanceType,
        attendanceDate: item.attendanceDate,
      })),
    });
  }
}
