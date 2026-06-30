import { AppointmentType } from "@domain/enum/appointmentType";
import { findValueInEnum } from "@domain/utils/enumUtils";
import {
  validateExternalIdField,
  validateOptionalStringField,
  validateStringField,
} from "@domain/utils/validationUtils";

export class CancelAppointmentPedagogueDTO {
  constructor(
    public readonly id: string,
    public readonly type: AppointmentType,
    public readonly reason?: string,
  ) {}

  static create(id: unknown, body: unknown): CancelAppointmentPedagogueDTO {
    const validatedId = validateExternalIdField(id, "id");

    const raw = body as Record<string, unknown>;
    const typeValue: string = validateStringField(raw.type, "type");
    const typeInEnum = findValueInEnum(AppointmentType, typeValue);
    const reason = validateOptionalStringField(raw.reason, "reason");

    return new CancelAppointmentPedagogueDTO(validatedId, typeInEnum, reason);
  }
}
