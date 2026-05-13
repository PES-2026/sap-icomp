import { validateDateField, validateStringField } from "@domain/utils/validationUtils";

import { CreateStudentResponse } from "./createStudentDto";

export type UpdateStudentResponse = CreateStudentResponse;

export class UpdateStudentDTO {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly dtBirth?: Date,
    public readonly email?: string,
    public readonly enrollmentId?: string,
    public readonly phoneNumber?: string,
    public readonly courseId?: string,
    public readonly diagnosis?: string,
    public readonly potential?: string,
    public readonly difficulties?: string,
  ) {}

  static create(id: unknown, body: unknown): UpdateStudentDTO {
    if (typeof id !== "string" || !id.trim()) {
      throw new Error("Attendance Id is required and must be a string");
    }

    if (typeof body !== "object" || body === null) {
      throw new Error(`Invalid input to ${UpdateStudentDTO.name}`);
    }

    const raw = body as Record<string, unknown>;

    let name = undefined;
    if (raw.name) {
      name = validateStringField(raw.name, "name");
    }
    let dtBirth = undefined;
    if (raw.dtBirth) {
      dtBirth = validateDateField(raw.dtBirth, "dtBirth");
    }
    let email = undefined;
    if (raw.email) {
      email = validateStringField(raw.email, "email");
    }
    let enrollmentId = undefined;
    if (raw.enrollmentId) {
      enrollmentId = validateStringField(raw.enrollmentId, "enrollmentId");
    }
    let phoneNumber = undefined;
    if (raw.phoneNumber) {
      phoneNumber = validateStringField(raw.phoneNumber, "phoneNumber");
    }
    let courseId = undefined;
    if (raw.courseId) {
      courseId = validateStringField(raw.courseId, "courseId");
    }
    let diagnosis = undefined;
    if (raw.diagnosis) {
      diagnosis = validateStringField(raw.diagnosis, "diagnosis");
    }
    let potential = undefined;
    if (raw.potential) {
      potential = validateStringField(raw.potential, "potential");
    }
    let difficulties = undefined;
    if (raw.difficulties) {
      difficulties = validateStringField(raw.difficulties, "difficulties");
    }

    return new UpdateStudentDTO(
      id.trim(),
      name,
      dtBirth,
      email,
      enrollmentId,
      phoneNumber,
      courseId,
      diagnosis,
      potential,
      difficulties,
    );
  }
}
