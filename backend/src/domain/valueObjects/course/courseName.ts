import { CourseNameTooLongError } from "@domain/errors/course/courseNameTooLongError";
import { CourseNameTooShortError } from "@domain/errors/course/courseNameTooShortError";
import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class CourseName {
  private readonly _value: string;

  private constructor(name: string) {
    this._value = name;
  }

  static create(name: string): Result<CourseName> {
    if (!name) {
      return Result.fail<CourseName>(new RequiredFieldError("course name"));
    }
    const trimmed = name.trim();
    if (trimmed.length < 3) {
      return Result.fail<CourseName>(new CourseNameTooShortError(trimmed.length));
    } else if (trimmed.length > 140) {
      return Result.fail<CourseName>(new CourseNameTooLongError(trimmed.length));
    }
    return Result.ok<CourseName>(new CourseName(trimmed));
  }

  get value(): string {
    return this._value;
  }
}
