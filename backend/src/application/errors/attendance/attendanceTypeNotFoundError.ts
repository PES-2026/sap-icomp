import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class AttendanceTypeNotFoundError extends ApplicationError {
  constructor(name: string) {
    super(`The attendance type: '${name}' was not found in the database`, ErrorCategory.BUSINESS_RULE);
  }
}
