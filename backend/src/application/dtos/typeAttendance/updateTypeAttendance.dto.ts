import { validateStringField } from "../../../domain/utils/validation.utils";

export interface UpdateTypeAttendanceResponse {
  externalId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
export class UpdateTypeAttendanceDTO {
  constructor(
    public externalId: string,
    public name: string,
  ) {}

  static update(value: unknown): UpdateTypeAttendanceDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error("Invalid input: expected an object");
    }

    const raw = value as Record<string, unknown>;
    const externalId = validateStringField(raw.externalId, "externalId");
    const name = validateStringField(raw.name, "name");

    return new UpdateTypeAttendanceDTO(externalId, name);
  }
}
