import {
  validateExternalIdField,
  validateOptionalStringField,
  validateStringField,
} from "@domain/utils/validationUtils";

export interface RequestAppointmentResponse {
  appointmentId: string;
  message: string;
}

export class RequestAppointmentDTO {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly enrollment: string,
    public readonly pedagogueId: string,
    public readonly courseId: string,
    public readonly availabilitySlotId: string,
    public readonly reason?: string,
  ) {}

  static create(value: unknown): RequestAppointmentDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${RequestAppointmentDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const name: string = validateStringField(raw.name, "name");
    const email: string = validateStringField(raw.email, "email");
    const enrollment: string = validateStringField(raw.enrollment, "enrollment");
    const pedagogueId: string = validateStringField(raw.pedagogueId, "pedagogueId");
    const courseId: string = validateStringField(raw.courseId, "courseId");
    const slotId: string = validateExternalIdField(raw.slotId, "slotId");
    const reason: string | undefined = validateOptionalStringField(raw.reason, "reason");

    return new RequestAppointmentDTO(name, email, enrollment, pedagogueId, courseId, slotId, reason);
  }
}
