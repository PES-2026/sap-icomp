import { DomainError, ErrorCategory } from "@domain/errors/domainError";

export class PasswordTooLongError extends DomainError {
  constructor(length: number) {
    super(`Password is too long. Maximum length is 128 characters, but got ${length}.`, ErrorCategory.VALIDATION);
  }
}
