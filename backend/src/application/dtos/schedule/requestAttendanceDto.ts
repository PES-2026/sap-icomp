import { Result } from "@domain/shared/result";
import {
  validateDateField,
  validateNumberField,
  validateOptionalStringField,
  validateStringField,
} from "@domain/utils/validationUtils";

export interface RequestAttendanceResponse {
  attendanceId: string;
  message: string;
}

export class RequestScheduleDTO {
  constructor(
    public readonly name: string,
    public readonly phoneNumber: string,
    public readonly enrollmentId: string,
    public readonly email: string,
    public readonly dtBirth: Date,
    public readonly pedagogueId: string,
    public readonly courseId: string,
    public readonly startTime: Date,
    public readonly durationMinutes: number,
    public readonly reason?: string,
  ) {}

  static create(value: unknown): Result<RequestScheduleDTO> {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${RequestScheduleDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const name: string = validateStringField(raw.name, "name");
    const phoneNumber: string = validateStringField(raw.phoneNumber, "phoneNumber");
    const enrollmentId: string = validateStringField(raw.enrollmentId, "enrollmentId");
    const email: string = validateStringField(raw.email, "email");
    const birthDate: Date = validateDateField(raw.dtBirth, "dtBirth");
    const pedagogueId: string = validateStringField(raw.pedagogueId, "pedagogueId");
    const courseId: string = validateStringField(raw.courseId, "courseId");
    const startTime: Date = validateDateField(raw.startTime, "startTime");
    const durationMinutes: number = validateNumberField(raw.durationMinutes, "durationMinutes");
    const reason: string | undefined = validateOptionalStringField(raw.reason, "reason");

    return Result.ok(
      new RequestScheduleDTO(
        name,
        phoneNumber,
        enrollmentId,
        email,
        birthDate,
        pedagogueId,
        courseId,
        startTime,
        durationMinutes,
        reason,
      ),
    );
  }
}
