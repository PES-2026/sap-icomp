import { validateStringField } from "@domain/utils/validationUtils";

export interface UpdateTypeAttendanceResponse {
  id: string;
  name: string;
}

export class UpdateTypeAttendanceDTO {
  constructor(
    public readonly id: string,
    public readonly name?: string,
  ) {}

  static create(id: unknown, body: unknown): UpdateTypeAttendanceDTO {
    if (typeof id !== "string" || !id.trim()) {
      throw new Error("TypeAttendance Id is required and must be a string");
    }

    if (typeof body !== "object" || body === null) {
      throw new Error(`Invalid input to ${UpdateTypeAttendanceDTO.name}`);
    }

    const raw = body as Record<string, unknown>;

    const name = raw.name ? validateStringField(raw.name, "name") : undefined;

    return new UpdateTypeAttendanceDTO(id.trim(), name);
  }
}
