import {
  PreviewAvailabilityDTO,
  PreviewAvailabilityItemResponse,
  ScheduleSlotItem,
} from "@application/dtos/availability/previewAvailability";
import { ApplicationError } from "@application/errors/applicationError";
import { AttendanceTimeGreatherThanZeroError } from "@application/errors/availability/attendanceTimeGreatherThanZeroError";
import { EndHourLowerThanStartHourError } from "@application/errors/availability/endHourLowerThanStartHourError";
import { ScheduleSlotPreview } from "@domain/entities/scheduleSlotPreview";
import { DaysOfWeekEnum } from "@domain/enum/daysOfWeek";
import { ScheduleSlotPreviewStatus } from "@domain/enum/scheduleSlotStatus";
import { DomainError } from "@domain/errors/domainError";
import { ScheduleSlotResult } from "@domain/repositories/results/scheduleSlotResult";
import { IScheduleSlotRepository } from "@domain/repositories/scheduleSlotRepository";
import { Result } from "@domain/shared/result";

export class PreviewAvailability {
  constructor(private readonly scheduleSlotRepository: IScheduleSlotRepository) {}

  async execute(
    dto: PreviewAvailabilityDTO,
  ): Promise<Result<Array<PreviewAvailabilityItemResponse>, ApplicationError | DomainError>> {
    if (dto.attendanceTime <= 0) {
      return Result.fail(new AttendanceTimeGreatherThanZeroError());
    }

    if (dto.endHour < dto.startHour) {
      return Result.fail(new EndHourLowerThanStartHourError(dto.startHour, dto.endHour));
    }

    const existingSlots = await this.scheduleSlotRepository.findAllSlotsByRange(
      dto.pedagogueId,
      dto.startDate,
      dto.endDate,
    );

    const previewItems = this.getAvailabilitySlots(
      dto.pedagogueId,
      dto.startDate,
      dto.endDate,
      dto.attendanceTime,
      dto.breakTime,
      dto.startHour,
      dto.endHour,
      existingSlots,
    );

    if (previewItems.isFailure) {
      return Result.fail(previewItems.error!);
    }

    return Result.ok(previewItems.getValue());
  }

  private getAvailabilitySlots(
    pedagogueId: string,
    startDate: Date,
    endDate: Date,
    attendanceTime: number,
    breakTime: number,
    startHour: number,
    endHour: number,
    existingSlots: ScheduleSlotResult[],
  ): Result<Array<PreviewAvailabilityItemResponse>> {
    const previewItems: Array<PreviewAvailabilityItemResponse> = [];

    const weekdayMap: Record<number, DaysOfWeekEnum> = {
      0: DaysOfWeekEnum.SUNDAY,
      1: DaysOfWeekEnum.MONDAY,
      2: DaysOfWeekEnum.TUESDAY,
      3: DaysOfWeekEnum.WEDNESDAY,
      4: DaysOfWeekEnum.THURSDAY,
      5: DaysOfWeekEnum.FRIDAY,
      6: DaysOfWeekEnum.SATURDAY,
    };

    const tempStartDate = new Date(startDate);
    const tempEndDate = new Date(endDate);
    tempStartDate.setHours(0, 0, 0, 0);
    tempEndDate.setHours(0, 0, 0, 0);

    const currentDate = new Date(tempStartDate);

    while (currentDate <= tempEndDate) {
      const slots: Array<ScheduleSlotItem> = [];
      let currentStartMinutes = startHour;

      while (currentStartMinutes + attendanceTime <= endHour) {
        const startDateTime = new Date(currentDate);
        startDateTime.setMinutes(startDateTime.getMinutes() + currentStartMinutes);

        const endDateTime = new Date(currentDate);
        endDateTime.setMinutes(endDateTime.getMinutes() + currentStartMinutes + attendanceTime);

        const existingSlot = existingSlots.find(
          (s) =>
            s.startDateTime.getTime() === startDateTime.getTime() && s.endDateTime.getTime() === endDateTime.getTime(),
        );

        const previewEntityResult = ScheduleSlotPreview.create({
          pedagogueId,
          startDateTime,
          endDateTime,
          attendanceTime,
          status: existingSlot ? existingSlot.status : ScheduleSlotPreviewStatus.AVAILABLE,
        });

        if (previewEntityResult.isFailure) {
          return Result.fail(previewEntityResult.error!);
        }

        const previewEntity = previewEntityResult.getValue();

        slots.push({
          id: previewEntity.id?.value ?? undefined,
          start: currentStartMinutes,
          end: currentStartMinutes + attendanceTime,
          attendanceTime: previewEntity.attendanceTime.value,
          status: previewEntity.status.value,
        });

        currentStartMinutes += attendanceTime + breakTime;
      }

      previewItems.push({
        date: new Date(currentDate),
        weekday: weekdayMap[currentDate.getDay()]!,
        slots,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return Result.ok(previewItems);
  }
}
