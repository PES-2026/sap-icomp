import { AppointmentType } from "@domain/enum/appointmentType";
import { findValueInEnum } from "@domain/utils/enumUtils";
import {
  validateExternalIdField,
  validateOptionalStringField,
  validateStringField,
  validateTokenField,
} from "@domain/utils/validationUtils";

export class RescheduleAppointmentStudentDTO {
  constructor(
    public readonly token: string,
    public readonly newAvailabilityId: string,
    public readonly type: AppointmentType,
    public readonly reason?: string,
  ) {}

  static create(token: unknown, body: unknown): RescheduleAppointmentStudentDTO {
    const validatedToken = validateTokenField(token, "token");

    if (typeof body !== "object" || body === null) {
      throw new Error(`Invalid input to ${RescheduleAppointmentStudentDTO.name}`);
    }

    const raw = body as Record<string, unknown>;
    const newAvailabilityId = validateExternalIdField(raw.newSlotId, "newAvailabilityId");
    const typeValue: string = validateStringField(raw.type, "type");
    const typeInEnum = findValueInEnum(AppointmentType, typeValue);
    const reason = validateOptionalStringField(raw.reason, "reason");

    return new RescheduleAppointmentStudentDTO(validatedToken, newAvailabilityId, typeInEnum, reason);
  }
}
