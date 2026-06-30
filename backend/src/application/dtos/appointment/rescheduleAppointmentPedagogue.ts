import { AppointmentType } from "@domain/enum/appointmentType";
import { findValueInEnum } from "@domain/utils/enumUtils";
import {
  validateExternalIdField,
  validateOptionalStringField,
  validateStringField,
} from "@domain/utils/validationUtils";

export class RescheduleAppointmentPedagogueDTO {
  constructor(
    public readonly appointmentId: string,
    public readonly newAvailabilityId: string,
    public readonly type: AppointmentType,
    public readonly reason?: string,
  ) {}

  static create(appointmentId: unknown, body: unknown): RescheduleAppointmentPedagogueDTO {
    const validatedAppointmentId = validateExternalIdField(appointmentId, "scheduleId");

    if (typeof body !== "object" || body === null) {
      throw new Error(`Invalid input to ${RescheduleAppointmentPedagogueDTO.name}`);
    }

    const raw = body as Record<string, unknown>;
    const newAvailabilityId = validateExternalIdField(raw.newSlotId, "newAvailabilityId");
    const typeValue: string = validateStringField(raw.type, "type");
    const typeInEnum = findValueInEnum(AppointmentType, typeValue);
    const reason = validateOptionalStringField(raw.reason, "reason");

    return new RescheduleAppointmentPedagogueDTO(validatedAppointmentId, newAvailabilityId, typeInEnum, reason);
  }
}
