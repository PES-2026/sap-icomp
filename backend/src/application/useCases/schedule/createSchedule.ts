import { ApplicationError } from "@application/errors/applicationError";
import { PedagogueNotFoundError } from "@application/errors/pedagogue/pedagogueNotFoundError";
import { Schedule } from "@domain/entities/schedule";
import { ScheduleSlot } from "@domain/entities/scheduleSlot";
import { ScheduleSlotStatusEnum } from "@domain/enum/scheduleSlotStatus";
import { DomainError } from "@domain/errors/domainError";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IScheduleRepository } from "@domain/repositories/scheduleRepository";
import { Result } from "@domain/shared/result";

import { CreateScheduleDTO, CreateScheduleResponse } from "../../dtos/schedule/createScheduleDto";

export class CreateSchedule {
  constructor(
    private repository: IScheduleRepository,
    private pedagogueRepository: IPedagogueRepository,
  ) {}

  async execute(dto: CreateScheduleDTO): Promise<Result<CreateScheduleResponse, ApplicationError | DomainError>> {
    const pedagogueExists = await this.pedagogueRepository.existsByUUID(dto.pedagogueId);
    if (!pedagogueExists) {
      return Result.fail(new PedagogueNotFoundError(dto.pedagogueId));
    }

    const scheduleEntity = Schedule.create({
      pedagogueId: dto.pedagogueId,
      startDate: dto.startDate,
      endDate: dto.endDate,
    });

    if (scheduleEntity.isFailure) {
      return Result.fail(scheduleEntity.error!);
    }

    const schedule = scheduleEntity.getValue();
    const slots: ScheduleSlot[] = [];

    for (const slotInput of dto.slots) {
      const slotEntity = ScheduleSlot.create({
        scheduleId: schedule.id.value,
        startDateTime: slotInput.startDateTime,
        endDateTime: slotInput.endDateTime,
        status: ScheduleSlotStatusEnum.AVAILABLE,
      });

      if (slotEntity.isFailure) {
        return Result.fail(slotEntity.error!);
      }

      slots.push(slotEntity.getValue());
    }

    await this.repository.save(schedule, slots);

    return Result.ok<CreateScheduleResponse>({
      id: schedule.id.value,
    });
  }
}
