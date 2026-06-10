import { DomainError, ErrorCategory } from "../domainError";

export class RegistrationTooShortError extends DomainError {
  constructor(length: number) {
    super(
      `Registration number is too short, less than 7 characters. Provided length: ${length}.`,
      ErrorCategory.VALIDATION,
    );
  }
}
