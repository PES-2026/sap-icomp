import { ErrorCategory } from "@domain/errors/domainError";
import { ApplicationError } from "../applicationError";

export class EnrollmentAlreadyExistsError extends ApplicationError {
  constructor(enrollment: string) {
    super(`The enrollment '${enrollment}' already exists to an another student`, ErrorCategory.BUSINESS_RULE);
  }
}
