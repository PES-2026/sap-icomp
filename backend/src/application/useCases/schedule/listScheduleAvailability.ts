import { ListScheduleAvailabilityDTO } from "@application/dtos/schedule/listScheduleAvailabilityDto";
import { ApplicationError } from "@application/errors/applicationError";
import { ScheduleSlotListParams } from "@domain/repositories/filters/scheduleSlotFilters";
import { PaginatedScheduleSlotResult } from "@domain/repositories/results/scheduleSlotResult";
import { IScheduleSlotRepository } from "@domain/repositories/scheduleSlotRepository";
import { Result } from "@domain/shared/result";

export class ListScheduleAvailability {
  constructor(private readonly scheduleSlotRepository: IScheduleSlotRepository) {}

  async execute(dto: ListScheduleAvailabilityDTO): Promise<Result<PaginatedScheduleSlotResult, ApplicationError>> {
    const params: ScheduleSlotListParams = {
      page: dto.page,
      limit: dto.limit,
      filters: dto.filters,
    };

    const result = await this.scheduleSlotRepository.findAll(params);

    return Result.ok<PaginatedScheduleSlotResult>(result);
  }
}
