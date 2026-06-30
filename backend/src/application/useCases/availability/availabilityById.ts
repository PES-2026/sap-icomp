import { AvailabilityByIdDTO } from "@application/dtos/availability/availabilityById";
import { ApplicationError } from "@application/errors/applicationError";
import { AvailabilityNotFoundError } from "@application/errors/availability/availabilityNotFoundError";
import { IAvailabilityRepository } from "@domain/repositories/availabilityRepository";
import { AvailabilityResult } from "@domain/repositories/results/availabilityResult";
import { Result } from "@domain/shared/result";

export class AvailabilityById {
  constructor(private readonly repository: IAvailabilityRepository) {}

  async execute(input: AvailabilityByIdDTO): Promise<Result<AvailabilityResult, ApplicationError>> {
    const availability: AvailabilityResult | null = await this.repository.findById(input.id);

    if (!availability) {
      return Result.fail<AvailabilityResult>(new AvailabilityNotFoundError(input.id));
    }

    return Result.ok<AvailabilityResult>(availability);
  }
}
