import { IAttendanceRepository } from "../../../domain/repositories/attendanceRepository";
import {
  AttendancesByStudentDTO,
  AttendancesByStudentRequest,
  AttendancesByStudentResponse,
} from "../../dtos/attendance/attendancesByStudent.dto";

export class AttendancesByStudent {
  constructor(private repository: IAttendanceRepository) {}

  async execute(
    dto: AttendancesByStudentDTO,
  ): Promise<AttendancesByStudentResponse | null> {
    const params: AttendancesByStudentRequest = {
      page: dto.page,
      limit: dto.limit,
      studentId: dto.studentId,
    };

    return this.repository.findByStudentId(params);
  }
}
