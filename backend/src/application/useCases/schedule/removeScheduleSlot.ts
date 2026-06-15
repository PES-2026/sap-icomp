import { RemoveScheduleSlotDTO } from "@application/dtos/schedule/removeScheduleSlotDto";
import { ScheduleSlotNotFoundError } from "@application/errors/schedule/scheduleSlotNotFoundError";
import { IScheduleSlotRepository } from "@domain/repositories/scheduleSlotRepository";
import { Result } from "@domain/shared/result";

export class RemoveScheduleSlot {
  constructor(private readonly scheduleSlotRepository: IScheduleSlotRepository) {}

  async execute(input: RemoveScheduleSlotDTO): Promise<Result<boolean, ScheduleSlotNotFoundError>> {
    const exists = await this.scheduleSlotRepository.existsByUUID(input.id);

    if (!exists) {
      return Result.fail<boolean>(new ScheduleSlotNotFoundError(input.id));
    }

    const result = await this.scheduleSlotRepository.remove(input.id);

    return Result.ok<boolean>(result);
  }
}
