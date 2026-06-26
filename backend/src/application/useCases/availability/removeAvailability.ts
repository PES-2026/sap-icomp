import { RemoveAvailabilityDTO } from "@application/dtos/availability/removeAvailability";
import { AvailabilityNotFoundError } from "@application/errors/availability/availabilityNotFoundError";
import { IAvailabilityRepository } from "@domain/repositories/availabilityRepository";
import { Result } from "@domain/shared/result";

export class RemoveAvailability {
  constructor(private readonly availabilityRepository: IAvailabilityRepository) {}

  async execute(input: RemoveAvailabilityDTO): Promise<Result<boolean, AvailabilityNotFoundError>> {
    const exists = await this.availabilityRepository.existsByUUID(input.id);

    if (!exists) {
      return Result.fail<boolean>(new AvailabilityNotFoundError(input.id));
    }

    const result = await this.availabilityRepository.remove(input.id);

    return Result.ok<boolean>(result);
  }
}
