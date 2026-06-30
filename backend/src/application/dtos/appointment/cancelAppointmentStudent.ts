import { AppointmentType } from "@domain/enum/appointmentType";
import { findValueInEnum } from "@domain/utils/enumUtils";
import { validateOptionalStringField, validateTokenField } from "@domain/utils/validationUtils";

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

  static create(token: unknown, type: unknown, body: unknown): CancelAppointmentStudentDTO {
    if (typeof token !== "string" || !token.trim()) {
      throw new Error("Token is required and must be a string");
    }
    if (typeof type !== "string" || !type.trim()) {
      throw new Error("Type is required and must be a string");
    }
    const validatedToken = validateTokenField(token, "token");

    const raw = body as Record<string, unknown>;
    const typeInEnum = findValueInEnum(AppointmentType, type);
    const reason = validateOptionalStringField(raw.reason, "reason");

    return new CancelAppointmentStudentDTO(validatedToken, typeInEnum, reason);
  }
}
