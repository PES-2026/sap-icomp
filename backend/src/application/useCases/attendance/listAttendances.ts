import { IAttendanceRepository } from "@domain/repositories/attendanceRepository";
import { Result } from "@domain/shared/result";
import { ApplicationError } from "@application/errors/applicationError";

import { ListAttendanceDTO, ListAttendanceResponse } from "../../dtos/attendance/listAttendanceDto";
import { AttendanceListParams } from "@domain/repositories/filters/attendanceFilters";

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
