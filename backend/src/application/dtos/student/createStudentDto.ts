import { validateDateField, validateStringField } from "@domain/utils/validationUtils";

export interface CreateStudentRequest {
  name: string;
  dtBirth: string;
  email: string;
  enrollmentId: string;
  phoneNumber: string;
  courseId: string;
  diagnosis?: string;
  diagnoses?: string[];
  potential?: string;
  difficulties?: string;
}

export interface CreateStudentResponse {
  id: string;
  name: string;
  dtBirth: Date;
  email: string;
  enrollmentId: string;
  phoneNumber: string;
  courseId: string;
  diagnoses?: string[];
  potential?: string;
  difficulties?: string;
}

export class CreateStudentDTO {
  constructor(
    public readonly name: string,
    public readonly dtBirth: Date,
    public readonly email: string,
    public readonly enrollmentId: string,
    public readonly phoneNumber: string,
    public readonly courseId: string,
    public readonly diagnoses: string[],
    public readonly potential?: string,
    public readonly difficulties?: string,
  ) {}

  static create(value: unknown): CreateStudentDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${CreateStudentDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const name: string = validateStringField(raw.name, "name");
    const dtBirth: Date = validateDateField(raw.dtBirth, "dtBirth");
    const email: string = validateStringField(raw.email, "email");
    const enrollmentId: string = validateStringField(raw.enrollmentId, "enrollmentId");
    const phoneNumber: string = validateStringField(raw.phoneNumber, "phoneNumber");
    const courseId: string = validateStringField(raw.courseId, "courseId");

    let diagnoses: string[] = [];
    if (Array.isArray(raw.diagnoses)) {
      diagnoses = raw.diagnoses.map((d, index) => validateStringField(d, `diagnoses[${index}]`));
    } else if (typeof raw.diagnosis === "string" && raw.diagnosis.trim() !== "") {
      diagnoses = [raw.diagnosis.trim()];
    }

    let potential = undefined;
    if (raw.potential) {
      potential = validateStringField(raw.potential, "potential");
    }
    let difficulties = undefined;
    if (raw.difficulties) {
      difficulties = validateStringField(raw.difficulties, "difficulties");
    }

    return new CreateStudentDTO(
      name,
      dtBirth,
      email,
      enrollmentId,
      phoneNumber,
      courseId,
      diagnoses,
      potential,
      difficulties,
    );
  }
}
