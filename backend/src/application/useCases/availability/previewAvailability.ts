import {
  PreviewAvailabilityDTO,
  PreviewAvailabilityItemResponse,
  ScheduleSlot,
} from "@application/dtos/availability/previewAvailability";
import { ApplicationError } from "@application/errors/applicationError";
import { AttendanceTimeGreatherThanZeroError } from "@application/errors/availability/attendanceTimeGreatherThanZeroError";
import { EndHourLowerThanStartHourError } from "@application/errors/availability/endHourLowerThanStartHourError";
import { DaysOfWeekEnum } from "@domain/enum/daysOfWeek";
import { ScheduleSlotStatusEnum } from "@domain/enum/scheduleSlotStatus";
import { DomainError } from "@domain/errors/domainError";
import { IAvailabilityRepository } from "@domain/repositories/availabilityRepository";
import { Result } from "@domain/shared/result";

export class PreviewAvailability {
  constructor(private repository: IAvailabilityRepository) {}

  async execute(
    dto: PreviewAvailabilityDTO,
  ): Promise<Result<Array<PreviewAvailabilityItemResponse>, ApplicationError | DomainError>> {
    if (dto.attendanceTime <= 0) {
      return Result.fail(new AttendanceTimeGreatherThanZeroError());
    }

    if (dto.endHour < dto.startHour) {
      return Result.fail(new EndHourLowerThanStartHourError(dto.startHour, dto.endHour));
    }

    const previewItems: Array<PreviewAvailabilityItemResponse> = PreviewAvailability.getAvailabilitySlots(
      dto.startDate,
      dto.endDate,
      dto.attendanceTime,
      dto.breakTime,
      dto.startHour,
      dto.endHour,
    );

    return Result.ok<Array<PreviewAvailabilityItemResponse>>(previewItems);
  }

  private static getAvailabilitySlots(
    startDate: Date,
    endDate: Date,
    attendanceTime: number,
    breakTime: number,
    startHour: number,
    endHour: number,
  ): Array<PreviewAvailabilityItemResponse> {
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

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const slots: Array<ScheduleSlot> = [];
      let currentStart = startHour;

      while (currentStart + attendanceTime <= endHour) {
        slots.push({
          start: currentStart,
          end: currentStart + attendanceTime,
          attendanceTime: attendanceTime,
          status: ScheduleSlotStatusEnum.AVAILABLE,
        });

        currentStart += attendanceTime + breakTime;
      }

      previewItems.push({
        date: new Date(currentDate),
        weekday: weekdayMap[currentDate.getDay()]!,
        slots,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return previewItems;
  }
}
