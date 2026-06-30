import { ListAvailabilitiesByPedagogueDTO } from "@application/dtos/availability/listAvailabilitiesByPedagogue";
import { ApplicationError } from "@application/errors/applicationError";
import { IAvailabilityRepository } from "@domain/repositories/availabilityRepository";
import { AvailabilityListParams } from "@domain/repositories/filters/availabilityFilters";
import { PaginatedAvailabilityResult } from "@domain/repositories/results/availabilityResult";
import { Result } from "@domain/shared/result";

export class ListAvailabilitiesByPedagogue {
  constructor(private readonly availabilityRepository: IAvailabilityRepository) {}

  async execute(
    dto: ListAvailabilitiesByPedagogueDTO,
  ): Promise<Result<PaginatedAvailabilityResult, ApplicationError>> {
    const params: AvailabilityListParams = {
      page: dto.page,
      limit: dto.limit,
      filters: dto.filters,
    };

    const result = await this.availabilityRepository.findAll(params);

    return Result.ok<PaginatedAvailabilityResult>(result);
  }
}
