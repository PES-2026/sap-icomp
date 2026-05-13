import { validateStringField } from "../../../domain/utils/validation.utils";

export interface CreateTypeAttendanceResponse {
  externalId: string;
  name: string;
}
export class CreateTypeAttendanceDto {
  constructor(public name: string) {}
  static create(value: unknown): CreateTypeAttendanceDto {
    if (typeof value !== "object" || value === null) {
      throw new Error("Invalid input: expected an object");
    }

    const raw = value as Record<string, unknown>;

    const name = validateStringField(raw.name, "name");

    return new CreateTypeAttendanceDto(name);
  }
}
