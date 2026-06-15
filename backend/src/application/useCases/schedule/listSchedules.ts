import { ListSchedulesDTO } from "@application/dtos/schedule/listSchedulesDto";
import { ApplicationError } from "@application/errors/applicationError";
import { ScheduleListParams } from "@domain/repositories/filters/scheduleFilters";
import { PaginatedScheduleResult } from "@domain/repositories/results/scheduleResult";
import { IScheduleRepository } from "@domain/repositories/scheduleRepository";
import { Result } from "@domain/shared/result";

export class ListSchedules {
  constructor(private readonly scheduleRepository: IScheduleRepository) {}

  async execute(dto: ListSchedulesDTO): Promise<Result<PaginatedScheduleResult, ApplicationError>> {
    const params: ScheduleListParams = {
      page: dto.page,
      limit: dto.limit,
      filters: dto.filters,
    };

    const result = await this.scheduleRepository.findAll(params);

    return Result.ok<PaginatedScheduleResult>(result);
  }
}
