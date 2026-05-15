import { DomainError, ErrorCategory } from "../domainError";

export class InvalidEmailFormatError extends DomainError {
  constructor(email: string) {
    super(`The email format '${email}' is invalid.`, ErrorCategory.VALIDATION);
  }
}
