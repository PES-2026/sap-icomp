import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class CourseAlreadyExistsError extends ApplicationError {
  constructor(field: string, value: string) {
    super(`The course ${field} '${value}' already exists.`, ErrorCategory.BUSINESS_RULE);
  }
}
