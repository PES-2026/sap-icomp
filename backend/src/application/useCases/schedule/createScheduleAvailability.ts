import {
  CreateScheduleAvailabilityDTO,
  CreateScheduleAvailabilityItemDTO,
  CreateScheduleAvailabilityResponseItem,
} from "@application/dtos/schedule/createScheduleAvailability";
import { ApplicationError } from "@application/errors/applicationError";
import { PedagogueNotFoundError } from "@application/errors/pedagogue/pedagogueNotFoundError";
import { DateIntegrityError } from "@application/errors/schedule/dateIntegrityError";
import { ScheduleConflictError } from "@application/errors/schedule/scheduleConflictError";
import { ScheduleSlot } from "@domain/entities/scheduleSlot";
import { DaysOfWeekEnum } from "@domain/enum/daysOfWeek";
import { ScheduleSlotStatusEnum } from "@domain/enum/scheduleSlotStatus";
import { DomainError } from "@domain/errors/domainError";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IScheduleSlotRepository } from "@domain/repositories/scheduleSlotRepository";
import { Result } from "@domain/shared/result";

import { GetWeekdayFromDate } from "./getWeekdayFromDate";

export class CreateScheduleAvailability {
  constructor(
    private readonly scheduleSlotRepository: IScheduleSlotRepository,
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly getWeekdayFromDate: GetWeekdayFromDate,
  ) {}

  async execute(
    dto: CreateScheduleAvailabilityDTO,
  ): Promise<Result<Array<CreateScheduleAvailabilityResponseItem>, ApplicationError | DomainError>> {
    const uniquePedagogueIds = [...new Set(dto.items.map((item) => item.pedagogueId))];
    const pedagoguesValidation = await this.validateWhetherPedagogueExists(uniquePedagogueIds);

    if (pedagoguesValidation.isFailure) {
      return Result.fail(pedagoguesValidation.error!);
    }

    const slotsToSave: Array<ScheduleSlot> = [];
    const responseItems: Array<CreateScheduleAvailabilityResponseItem> = [];

    for (const item of dto.items) {
      const weekDayValidation = this.validateWeekDay(item.date, item.weekday);

      if (weekDayValidation.isFailure) {
        return Result.fail(weekDayValidation.error!);
      }

      const [startHour, startMinute] = item.start.split(":").map(Number);
      const [endHour, endMinute] = item.end.split(":").map(Number);

      const startDateTime = new Date(item.date);
      startDateTime.setHours(startHour!, startMinute!, 0, 0);

      const endDateTime = new Date(item.date);
      endDateTime.setHours(endHour!, endMinute!, 0, 0);

      const overlapValidation = await this.validateSlotOverlap(item, startDateTime, endDateTime);

      if (overlapValidation.isFailure) {
        return Result.fail(overlapValidation.error!);
      }

      const slotResult = ScheduleSlot.create({
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        status: ScheduleSlotStatusEnum.CREATED,
        attendanceTime: item.attendanceTime,
        pedagogueId: item.pedagogueId,
      });

      if (slotResult.isFailure) {
        return Result.fail(slotResult.error!);
      }

      const slot = slotResult.getValue();
      slotsToSave.push(slot);

      responseItems.push({
        id: slot.id.value,
        status: ScheduleSlotStatusEnum.CREATED,
        date: item.date,
        weekday: item.weekday,
        pedagogueId: item.pedagogueId,
        start: item.start,
        end: item.end,
        attendanceTime: item.attendanceTime,
      });
    }

    if (slotsToSave.length > 0) {
      await this.scheduleSlotRepository.saveMany(slotsToSave);
    }

    return Result.ok<Array<CreateScheduleAvailabilityResponseItem>>(responseItems);
  }

  private async validateWhetherPedagogueExists(pedagoguesIds: Array<string>) {
    for (const pedagogueId of pedagoguesIds) {
      const pedagogue = await this.pedagogueRepository.findById(pedagogueId);
      if (!pedagogue) {
        return Result.fail(new PedagogueNotFoundError());
      }
    }
    return Result.ok();
  }

  private validateWeekDay(date: Date, weekday: DaysOfWeekEnum) {
    const actualWeekday = this.getWeekdayFromDate.execute(date);

    if (actualWeekday !== weekday) {
      return Result.fail(new DateIntegrityError(date.toDateString(), actualWeekday, weekday));
    }
    return Result.ok();
  }

  private async validateSlotOverlap(item: CreateScheduleAvailabilityItemDTO, startDateTime: Date, endDateTime: Date) {
    const existingSlots = await this.scheduleSlotRepository.findAllSlotsByRange(
      item.pedagogueId,
      startDateTime,
      endDateTime,
    );

    const hasConflict = existingSlots.some(
      (slot) =>
        (startDateTime >= slot.startDateTime && startDateTime < slot.endDateTime) ||
        (endDateTime > slot.startDateTime && endDateTime <= slot.endDateTime) ||
        (startDateTime <= slot.startDateTime && endDateTime >= slot.endDateTime),
    );

    if (hasConflict) {
      return Result.fail(new ScheduleConflictError(item.pedagogueId, item.start, item.end, item.date.toDateString()));
    }

    return Result.ok();
  }
}
