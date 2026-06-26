import { AppointmentStatusEnum } from "@domain/enum/appointmentStatus";
import { ListAppointmentFilters } from "@domain/repositories/filters/appointmentFilters";
import { findValueInEnum } from "@domain/utils/enumUtils";
import {
  validateDateField,
  validateExternalIdField,
  validateNumberField,
  validateStringField,
} from "@domain/utils/validationUtils";

import { validatePageLimitValues } from "../shared/paginationValidationsDto";

export class ListAppointmentsByPedagogueDTO {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly filters: ListAppointmentFilters,
  ) {}

  static create(pedagogueId: unknown, value: unknown): ListAppointmentsByPedagogueDTO {
    if (typeof pedagogueId !== "string" || !pedagogueId.trim()) {
      throw new Error("Pedagogue Id is required and must be a string");
    }

    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${ListAppointmentsByPedagogueDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const page = validateNumberField(raw.page, "page");
    const limit = validateNumberField(raw.limit, "limit");

    const filters: ListAppointmentFilters = {};

    filters.pedagogueId = validateExternalIdField(pedagogueId, "pedagogueId");
    if (raw.status) {
      filters.status = findValueInEnum(AppointmentStatusEnum, validateStringField(raw.status, "status"));
    }
    if (raw.startDate) {
      filters.startDate = validateDateField(raw.startDate, "startDate");
    }
    if (raw.endDate) {
      filters.endDate = validateDateField(raw.endDate, "endDate");
    }
    if (raw.studentName) {
      filters.studentName = validateStringField(raw.studentName, "studentName");
    }
    if (raw.studentEmail) {
      filters.studentEmail = validateStringField(raw.studentEmail, "studentEmail");
    }
    if (raw.studentEnrollment) {
      filters.studentEnrollment = validateStringField(raw.studentEnrollment, "studentEnrollment");
    }
    if (raw.studentCourse) {
      filters.studentCourse = validateStringField(raw.studentCourse, "studentCourse");
    }

    validatePageLimitValues(page, limit);

    return new ListAppointmentsByPedagogueDTO(page, limit, filters);
  }
}
