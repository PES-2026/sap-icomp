import {
  Availability,
  PreviewAvailabilityDTO,
  PreviewAvailabilityItemResponse,
} from "@application/dtos/availability/previewAvailability";
import { ApplicationError } from "@application/errors/applicationError";
import { EndHourLowerThanStartHourError } from "@application/errors/appointment/endHourLowerThanStartHourError";
import { AttendanceTimeGreatherThanZeroError } from "@application/errors/availability/attendanceTimeGreatherThanZeroError";
import { AvailabilityPreview } from "@domain/entities/availabilityPreview";
import { AvailabilityPreviewStatus } from "@domain/enum/availabilityStatus";
import { DomainError } from "@domain/errors/domainError";
import { IAvailabilityRepository } from "@domain/repositories/availabilityRepository";
import { AvailabilityResult } from "@domain/repositories/results/availabilityResult";
import { Result } from "@domain/shared/result";

import { GetWeekdayFromDate } from "./getWeekdayFromDate";

export class PreviewAvailability {
  constructor(
    private readonly availabilityRepository: IAvailabilityRepository,
    private readonly getWeekdayFromDate: GetWeekdayFromDate,
  ) {}

  async execute(
    dto: PreviewAvailabilityDTO,
  ): Promise<Result<Array<PreviewAvailabilityItemResponse>, ApplicationError | DomainError>> {
    if (dto.attendanceTime <= 0) {
      return Result.fail(new AttendanceTimeGreatherThanZeroError());
    }

    if (dto.endHour < dto.startHour) {
      return Result.fail(new EndHourLowerThanStartHourError(dto.startHour, dto.endHour));
    }

    const startRange = new Date(dto.startDate);
    startRange.setHours(0, 0, 0, 0);

    const endRange = new Date(dto.endDate);
    endRange.setHours(23, 59, 59, 999);

    const existingSlots = await this.availabilityRepository.findAllAvailabilitiesByRange(
      dto.pedagogueId,
      startRange,
      endRange,
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
      return Result.fail(previewItems.error as DomainError);
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
    existingSlots: AvailabilityResult[],
  ): Result<Array<PreviewAvailabilityItemResponse>> {
    const previewItems: Array<PreviewAvailabilityItemResponse> = [];

    const tempStartDate = new Date(startDate);
    const tempEndDate = new Date(endDate);
    tempStartDate.setHours(0, 0, 0, 0);
    tempEndDate.setHours(0, 0, 0, 0);

    const currentDate = new Date(tempStartDate);

    while (currentDate <= tempEndDate) {
      const slots: Array<Availability> = [];
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

        const previewEntityResult = AvailabilityPreview.create({
          id: existingSlot?.id,
          pedagogueId: pedagogueId,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          attendanceTime: attendanceTime,
          status: existingSlot ? existingSlot.status : AvailabilityPreviewStatus.AVAILABLE,
        });

        if (previewEntityResult.isFailure) {
          return Result.fail(previewEntityResult.error!);
        }

        const previewEntity = previewEntityResult.getValue();

        const slotItem: Availability = {
          start: currentStartMinutes,
          end: currentStartMinutes + attendanceTime,
          attendanceTime: previewEntity.attendanceTime.value,
          status: previewEntity.status.value,
        };

        if (previewEntity.id?.value) {
          slotItem.id = previewEntity.id.value;
        }

        slots.push(slotItem);

        currentStartMinutes += attendanceTime + breakTime;
      }

      previewItems.push({
        date: new Date(currentDate),
        weekday: this.getWeekdayFromDate.execute(currentDate),
        slots,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return Result.ok(previewItems);
  }
}
