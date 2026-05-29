import { DomainError, ErrorCategory } from "@domain/errors/domainError";

export class InvalidPasswordError extends DomainError {
  constructor() {
    super("Invalid current password", ErrorCategory.VALIDATION);
  }
}
