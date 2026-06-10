import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class CourseVO {
  private readonly _value: string;

  private constructor(course: string) {
    this._value = course;
  }

  static create(course: string): Result<CourseVO, RequiredFieldError> {
    const validationResult = CourseVO.validate(course);
    if (validationResult.isFailure) {
      return Result.fail<CourseVO>(validationResult.error!);
    }

    return Result.ok<CourseVO>(new CourseVO(course));
  }

  static fromTrusted(course: string): CourseVO {
    return new CourseVO(course);
  }

  get value(): string {
    return this._value;
  }

  private static validate(value: string): Result<void> {
    if (typeof value !== "string" || value.trim() === "") {
      return Result.fail<void>(new RequiredFieldError("demand"));
    }
    return Result.ok<void>();
  }
}
