import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class AttendanceTypeAlreadyExistsError extends ApplicationError {
  constructor(name: string) {
    super(`The attendance type '${name}' already exists.`, ErrorCategory.BUSINESS_RULE);
  }
}
