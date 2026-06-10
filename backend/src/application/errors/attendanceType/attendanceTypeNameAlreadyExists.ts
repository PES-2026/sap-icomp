import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class AttendanceTypeNameAlreadyExistsError extends ApplicationError {
  constructor(name: string) {
    super(`The attendance type with the '${name}' already exists`, ErrorCategory.BUSINESS_RULE);
  }
}
