import { AppointmentType } from "@domain/enum/appointmentType";
import { findValueInEnum } from "@domain/utils/enumUtils";
import { validateOptionalStringField, validateStringField, validateTokenField } from "@domain/utils/validationUtils";

export interface CancelAppointmentResponse {
  appointmentId: string;
  message: string;
}

export class CancelAppointmentStudentDTO {
  constructor(
    public readonly token: string,
    public readonly type: AppointmentType,
    public readonly reason?: string,
  ) {}

  static create(token: unknown, body: unknown): CancelAppointmentStudentDTO {
    const validatedToken = validateTokenField(token, "token");

    const raw = body as Record<string, unknown>;
    const typeValue: string = validateStringField(raw.type, "type");
    const typeInEnum = findValueInEnum(AppointmentType, typeValue);
    const reason = validateOptionalStringField(raw.reason, "reason");

    return new CancelAppointmentStudentDTO(validatedToken, typeInEnum, reason);
  }
}
