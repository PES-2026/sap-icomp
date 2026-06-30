import { AppointmentType } from "@domain/enum/appointmentType";
import { findValueInEnum } from "@domain/utils/enumUtils";
import { validateExternalIdField, validateStringField } from "@domain/utils/validationUtils";

export class AppointmentByIdDTO {
  constructor(
    public readonly id: string,
    public readonly type: AppointmentType,
  ) {}

  static create(id: unknown, type: unknown): AppointmentByIdDTO {
    if (typeof id !== "string" || !id.trim()) {
      throw new Error("Appointment Id is required and must be a string");
    }
    if (typeof type !== "string" || !id.trim()) {
      throw new Error("Type is required and must be a string");
    }

    const idValue: string = validateExternalIdField(id, "id");
    const typeValue: string = validateStringField(type, "type");
    const typeInEnum = findValueInEnum(AppointmentType, typeValue);

    return new AppointmentByIdDTO(idValue, typeInEnum);
  }
}
