import { ApplicationError } from "@application/errors/applicationError";
import { InvalidScheduleParamsError } from "@application/errors/schedule/invalidScheduleParamsError";
import { DomainError } from "@domain/errors/domainError";
import { Result } from "@domain/shared/result";

import {
  CreateSchedulePreviewDTO,
  CreateSchedulePreviewResponse,
  ScheduleSlotPreview,
} from "../../dtos/schedule/createSchedulePreviewDto";

export class CreateSchedulePreviewUseCase {
  async execute(
    dto: CreateSchedulePreviewDTO,
  ): Promise<Result<CreateSchedulePreviewResponse, ApplicationError | DomainError>> {
    const { startTime, endTime, attendanceDuration, startDate, endDate } = dto;

    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);
    const durationMinutes = this.timeToMinutes(attendanceDuration);

    if (durationMinutes <= 0) {
      return Result.fail(new InvalidScheduleParamsError("Attendance duration must be greater than 0."));
    }

    if (startMinutes >= endMinutes) {
      return Result.fail(new InvalidScheduleParamsError("Start time must be before end time."));
    }

    const slots: ScheduleSlotPreview[] = [];

    const currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);
    const lastDate = new Date(endDate);
    lastDate.setHours(0, 0, 0, 0);

    while (currentDate <= lastDate) {
      let currentSlotStart = startMinutes;

      while (currentSlotStart + durationMinutes <= endMinutes) {
        const slotStart = new Date(currentDate);
        slotStart.setHours(Math.floor(currentSlotStart / 60), currentSlotStart % 60, 0, 0);

        const slotEnd = new Date(currentDate);
        slotEnd.setHours(
          Math.floor((currentSlotStart + durationMinutes) / 60),
          (currentSlotStart + durationMinutes) % 60,
          0,
          0,
        );

        slots.push({
          startDateTime: this.formatDateToISOWithoutZ(slotStart),
          endDateTime: this.formatDateToISOWithoutZ(slotEnd),
        });

        currentSlotStart += durationMinutes;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return Result.ok<CreateSchedulePreviewResponse>({ slots });
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours! * 60 + minutes!;
  }

  private formatDateToISOWithoutZ(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
}
