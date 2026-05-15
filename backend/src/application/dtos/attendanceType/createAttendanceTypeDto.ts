import { validateStringField } from "@domain/utils/validationUtils";

export interface CreateAttendanceTypeResponse {
  id: string;
  name: string;
}

export class CreateAttendanceTypeDTO {
  constructor(public readonly name: string) {}

  static create(value: unknown): CreateAttendanceTypeDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${CreateAttendanceTypeDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const name = validateStringField(raw.name, "name");

    return new CreateAttendanceTypeDTO(name);
  }
}
