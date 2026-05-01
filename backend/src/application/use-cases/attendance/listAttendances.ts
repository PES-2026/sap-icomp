import { IAttendanceRepository } from "../../../domain/repositories/attendanceRepository";
import {
  ListAttendanceDTO,
  ListAttendanceRequest,
  ListAttendanceResponse,
} from "../../dtos/attendance/listAttendance.dto";

export class ListAttendances {
  constructor(private repository: IAttendanceRepository) {}

  async execute(dto: ListAttendanceDTO): Promise<ListAttendanceResponse> {
    const params: ListAttendanceRequest = {
      page: dto.page,
      limit: dto.limit,
      filters: dto.filters,
    };

    return this.repository.findAll(params);
  }
}
