import { DomainError, ErrorCategory } from "../domainError";

export class EmailTooLongError extends DomainError {
  constructor(length: number) {
    super(`The email address is too long (${length} characters). Maximum allowed is 256.`, ErrorCategory.VALIDATION);
  }
}
