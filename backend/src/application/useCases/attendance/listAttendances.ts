import { ApplicationError } from "@application/errors/applicationError";
import { IAttendanceRepository } from "@domain/repositories/attendanceRepository";
import { AttendanceListParams } from "@domain/repositories/filters/attendanceFilters";
import { PaginatedAttendanceResult } from "@domain/repositories/results/attendanceResult";
import { Result } from "@domain/shared/result";

import { ListAttendanceDTO } from "../../dtos/attendance/listAttendanceDto";

export class ListAttendances {
  constructor(private repository: IAttendanceRepository) {}

  async execute(dto: ListAttendanceDTO): Promise<Result<PaginatedAttendanceResult, ApplicationError>> {
    const params: AttendanceListParams = {
      page: dto.page,
      limit: dto.limit,
      filters: dto.filters,
    };

    const result = await this.repository.findAll(params);

    return Result.ok<PaginatedAttendanceResult>(result);
  }
}
