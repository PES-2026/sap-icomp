import { ApplicationError } from "@application/errors/applicationError";
import { AvailabilityNotFoundError } from "@application/errors/availability/availabilityNotFoundError";
import { IAvailabilityRepository } from "@domain/repositories/availabilityRepository";
import { AvailabilityResult } from "@domain/repositories/results/availabilityResult";
import { Result } from "@domain/shared/result";
import { formatTime } from "@domain/utils/timeUtils";

import { CreateAvailability } from "./createAvailability";

type ExecuteProps = {
  availabilityId: string;
};

export class releaseAvailability {
  constructor(
    private readonly repository: IAvailabilityRepository,
    private readonly createAvailability: CreateAvailability,
  ) {}

  async execute(input: ExecuteProps): Promise<Result<AvailabilityResult, ApplicationError>> {
    const availability: AvailabilityResult | null = await this.repository.findById(input.availabilityId);

    if (!availability) {
      return Result.fail<AvailabilityResult>(new AvailabilityNotFoundError(input.availabilityId));
    }

    await this.repository.releaseAvailabilityById(input.availabilityId);
    const availabilitiesCreateValidation = await this.createAvailability.execute({
      items: [
        {
          date: availability.startDateTime,
          start: formatTime(availability.startDateTime),
          end: formatTime(availability.endDateTime),
          pedagogueId: availability.pedagogueId,
          attendanceTime: availability.attendanceTime,
          weekday: availability.weekDay,
        },
      ],
    });
    if (availabilitiesCreateValidation.isFailure) {
      return Result.fail(availabilitiesCreateValidation.error!);
    }

    return Result.ok<AvailabilityResult>(availability);
  }
}
