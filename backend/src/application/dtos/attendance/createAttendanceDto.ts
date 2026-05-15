import { validateDateField, validateStringField } from "@domain/utils/validationUtils";

export interface CreateAttendanceRequest {
  studentId: string;
  date: string;
  typeId: string;
  demand: string;
  generalObservations?: string;
}

export interface CreateAttendanceResponse {
  id: string;
  studentId: string;
  date: Date;
  typeId: string;
  demand: string;
  generalObservations: string;
}

export class CreateAttendanceDTO {
  constructor(
    public readonly studentId: string,
    public readonly date: Date,
    public readonly typeId: string,
    public readonly demand: string,
    public readonly generalObservations?: string,
  ) {}

  static create(value: unknown): CreateAttendanceDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${CreateAttendanceDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const studentId: string = validateStringField(raw.studentId, "studentId");
    const date: Date = validateDateField(raw.date, "date");
    const typeId: string = validateStringField(raw.type, "type");
    const demand: string = validateStringField(raw.demand, "demand");

    let generalObservations = undefined;
    if (raw.generalObservations) {
      generalObservations = validateStringField(raw.generalObservations, "generalObservations");
    }

    return new CreateAttendanceDTO(studentId, date, typeId, demand, generalObservations);
  }
}
