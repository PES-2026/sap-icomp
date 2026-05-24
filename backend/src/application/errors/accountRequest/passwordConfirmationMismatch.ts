import { DomainError, ErrorCategory } from "@domain/errors/domainError";

export class PasswordConfirmationMismatchError extends DomainError {
  constructor() {
    super("Password and password confirmation do not match", ErrorCategory.VALIDATION);
  }
}
