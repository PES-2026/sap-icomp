import { DomainError, ErrorCategory } from "../domainError";

export class RegistrationTooLongError extends DomainError {
  constructor(length: number) {
    super(
      `Registration number is too long, exceeding 10 characters. Provided length: ${length}.`,
      ErrorCategory.VALIDATION,
    );
  }
}
