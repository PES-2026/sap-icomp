import { RemoveManyAvailabilitiesDTO } from "@application/dtos/availability/removeManyAvailabilities";
import { IAvailabilityRepository } from "@domain/repositories/availabilityRepository";
import { Result } from "@domain/shared/result";

export class RemoveManyAvailabilities {
  constructor(private readonly availabilityRepository: IAvailabilityRepository) {}

  async execute(input: RemoveManyAvailabilitiesDTO): Promise<Result<number>> {
    const count = await this.availabilityRepository.removeMany(input.ids);
    return Result.ok<number>(count);
  }
}
