import { IAttendanceRepository, AttendancesByStudentRequest } from "@domain/repositories/attendanceRepository";

import { AttendancesByStudentDTO, AttendancesByStudentResponse } from "../../dtos/attendance/attendancesByStudentDto";

export class AttendancesByStudent {
  constructor(private repository: IAttendanceRepository) {}

  async execute(dto: AttendancesByStudentDTO): Promise<AttendancesByStudentResponse | null> {
    const params: AttendancesByStudentRequest = {
      page: dto.page,
      limit: dto.limit,
      studentId: dto.studentId,
    };

    const result = await this.repository.findByStudentId(params);

    if (!result) return null;

    return {
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
    };
  }
}
