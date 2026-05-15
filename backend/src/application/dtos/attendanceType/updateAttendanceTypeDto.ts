import { validateStringField } from "@domain/utils/validationUtils";

export interface UpdateAttendanceTypeResponse {
  id: string;
  name: string;
}

export class UpdateAttendanceTypeDTO {
  constructor(
    public readonly id: string,
    public readonly name?: string,
  ) {}

  static create(id: unknown, body: unknown): UpdateAttendanceTypeDTO {
    if (typeof id !== "string" || !id.trim()) {
      throw new Error("Attendance Type Id is required and must be a string");
    }

    if (typeof body !== "object" || body === null) {
      throw new Error(`Invalid input to ${UpdateAttendanceTypeDTO.name}`);
    }

    const raw = body as Record<string, unknown>;

    const name = raw.name ? validateStringField(raw.name, "name") : undefined;

    return new UpdateAttendanceTypeDTO(id.trim(), name);
  }
}
