import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { EnrollmentSizeError } from "@domain/errors/student/enrollmentSize";
import { InvalidStudentDataError } from "@domain/errors/student/invalidStudentData";
import { Result } from "@domain/shared/result";

type EnrollmentErrors = RequiredFieldError | InvalidStudentDataError | EnrollmentSizeError;

export class EnrollmentVO {
  private _value: string;

  private constructor(enrollment: string) {
    this._value = enrollment;
  }

  static create(enrollment: string): Result<EnrollmentVO, EnrollmentErrors> {
    const validationResult = EnrollmentVO.validate(enrollment);
    if (validationResult.isFailure) {
      return Result.fail<EnrollmentVO>(validationResult.error!);
    }
    return Result.ok<EnrollmentVO>(new EnrollmentVO(enrollment));
  }

  static fromTrusted(enrollment: string): EnrollmentVO {
    return new EnrollmentVO(enrollment);
  }

  get value(): string {
    return this._value;
  }

  private static validate(value: string): Result<void> {
    if (typeof value !== "string" || value.trim() === "") {
      return Result.fail<void>(new RequiredFieldError("demand"));
    }
    const regex = /^[0-9]+$/;
    if (!regex.test(value)) {
      return Result.fail<void>(new InvalidStudentDataError("Invalid enrollment: must be only numeric characters"));
    } else if (value.length < 8) {
      return Result.fail<void>(new EnrollmentSizeError());
    }
    return Result.ok<void>();
  }
}
