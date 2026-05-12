import { validateStringField } from "@domain/utils/validationUtils";

export interface StudentByIdResponse {
  name: string;
  dtBirth: string;
  email: string;
  enrollmentId: string;
  phoneNumber: string;
  courseId: string;
  diagnosis?: string;
  potential?: string;
  difficulties?: string;
}

export class StudentByIdDTO {
  constructor(public readonly id: string) {}

  static create(value: unknown): StudentByIdDTO {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error("Student Id is required and must be a string");
    }

    const id: string = validateStringField(value, "id");

    return new StudentByIdDTO(id);
  }
}
