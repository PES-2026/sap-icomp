import { ApplicationError } from "@application/errors/applicationError";
import { IAttendanceRepository } from "@domain/repositories/attendanceRepository";
import { AttendanceListParams } from "@domain/repositories/filters/attendanceFilters";
import { Result } from "@domain/shared/result";

import { ListAttendanceDTO, ListAttendanceResponse } from "../../dtos/attendance/listAttendanceDto";

export class ListAttendances {
  constructor(private repository: IAttendanceRepository) {}

  async execute(dto: ListAttendanceDTO): Promise<Result<ListAttendanceResponse, ApplicationError>> {
    const params: AttendanceListParams = {
      page: dto.page,
      limit: dto.limit,
      filters: dto.filters,
    };

    const result = await this.repository.findAll(params);

    return Result.ok<ListAttendanceResponse>(result);
  }
}
