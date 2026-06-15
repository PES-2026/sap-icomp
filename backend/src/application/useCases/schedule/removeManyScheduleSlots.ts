import { RemoveScheduleSlotsDTO } from "@application/dtos/schedule/removeScheduleSlotsDto";
import { IScheduleSlotRepository } from "@domain/repositories/scheduleSlotRepository";
import { Result } from "@domain/shared/result";

export class RemoveManyScheduleSlots {
  constructor(private readonly scheduleSlotRepository: IScheduleSlotRepository) {}

  async execute(input: RemoveScheduleSlotsDTO): Promise<Result<number>> {
    const count = await this.scheduleSlotRepository.removeMany(input.ids);
    return Result.ok<number>(count);
  }
}
