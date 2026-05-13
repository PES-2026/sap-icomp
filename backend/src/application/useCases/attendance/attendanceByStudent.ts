import { AttendancesByStudentDTO } from "@application/dtos/attendance/attendancesByStudentDto";
import { ApplicationError } from "@application/errors/applicationError";
import { AttendancesNotFoundError } from "@application/errors/attendance/attendancesNotFoundError";
import { IAttendanceRepository } from "@domain/repositories/attendanceRepository";
import { FindByStudentParams, PaginatedAttendanceResult } from "@domain/repositories/results/attendanceResult";
import { Result } from "@domain/shared/result";

export class AttendancesByStudent {
  constructor(private repository: IAttendanceRepository) {}

  async execute(dto: AttendancesByStudentDTO): Promise<Result<PaginatedAttendanceResult, ApplicationError>> {
    const params: FindByStudentParams = {
      page: dto.page,
      limit: dto.limit,
      studentId: dto.studentId,
    };

    const attendances = await this.repository.findByStudentId(params);

    if (!attendances) {
      return Result.fail<PaginatedAttendanceResult>(new AttendancesNotFoundError(dto.studentId));
    }

    return Result.ok<PaginatedAttendanceResult>(attendances);
  }
}
