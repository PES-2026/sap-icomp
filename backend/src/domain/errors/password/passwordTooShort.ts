import { DomainError, ErrorCategory } from "@domain/errors/domainError";

export class PasswordTooShortError extends DomainError {
  constructor(length: number) {
    super(`Password is too short. Minimum length is 8 characters, but got ${length}.`, ErrorCategory.VALIDATION);
  }
}
