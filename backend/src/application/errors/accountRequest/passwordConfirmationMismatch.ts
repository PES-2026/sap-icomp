import { DomainError, ErrorCategory } from "@domain/errors/domainError";

export class PasswordConfirmationMismatchError extends DomainError {
  constructor() {
    super("Passwords do not match", ErrorCategory.VALIDATION);
  }
}
