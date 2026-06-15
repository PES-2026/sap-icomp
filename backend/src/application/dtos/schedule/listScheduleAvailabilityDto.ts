import { ScheduleSlotStatusEnum } from "@domain/enum/scheduleSlotStatus";
import { ListScheduleSlotFilters } from "@domain/repositories/filters/scheduleSlotFilters";
import { findValueInEnum } from "@domain/utils/enumUtils";
import { validateDateField, validateNumberField, validateStringField } from "@domain/utils/validationUtils";

import { validatePageLimitValues } from "../shared/paginationValidationsDto";

export class ListScheduleAvailabilityDTO {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly filters: ListScheduleSlotFilters,
  ) {}

  static create(value: unknown, pedagogueId?: string): ListScheduleAvailabilityDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${ListScheduleAvailabilityDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const page = validateNumberField(raw.page, "page");
    const limit = validateNumberField(raw.limit, "limit");

    const filters: ListScheduleSlotFilters = {};

    if (pedagogueId) {
      filters.pedagogueId = pedagogueId;
    }

    if (raw.status) {
      filters.status = findValueInEnum(ScheduleSlotStatusEnum, validateStringField(raw.status, "status"));
    }
    if (raw.date) {
      filters.date = validateDateField(raw.date, "date");
    }
    if (raw.startDate) {
      filters.startDate = validateDateField(raw.startDate, "startDate");
    }
    if (raw.endDate) {
      filters.endDate = validateDateField(raw.endDate, "endDate");
    }
    if (raw.attendanceTime) {
      filters.attendanceTime = validateNumberField(raw.attendanceTime, "attendanceTime");
    }

    validatePageLimitValues(page, limit);

    return new ListScheduleAvailabilityDTO(page, limit, filters);
  }
}
