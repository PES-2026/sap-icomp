import { validateStringField } from "@domain/utils/validationUtils";

export interface CreateTypeAttendanceResponse {
  id: string;
  name: string;
}

export class CreateTypeAttendanceDTO {
  constructor(public readonly name: string) {}

  static create(value: unknown): CreateTypeAttendanceDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${CreateTypeAttendanceDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const name = validateStringField(raw.name, "name");

    return new CreateTypeAttendanceDTO(name);
  }
}
