import { IAttendanceRepository, ListAttendanceRequest } from "@domain/repositories/attendanceRepository";

import { ListAttendanceDTO, ListAttendanceResponse } from "../../dtos/attendance/listAttendanceDto";

export class ListAttendances {
  constructor(private repository: IAttendanceRepository) {}

  async execute(dto: ListAttendanceDTO): Promise<ListAttendanceResponse> {
    const params: ListAttendanceRequest = {
      page: dto.page,
      limit: dto.limit,
      filters: dto.filters,
    };

    const result = await this.repository.findAll(params);

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
