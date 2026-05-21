import { DomainError, ErrorCategory } from "../domainError";

export class EmailAccountTooLongError extends DomainError {
  constructor(length: number) {
    super(
      `The email account part is too long (${length} characters). Maximum allowed is 64.`,
      ErrorCategory.VALIDATION,
    );
  }
}
