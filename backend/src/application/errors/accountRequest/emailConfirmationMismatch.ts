import { DomainError, ErrorCategory } from "@domain/errors/domainError";

export class EmailConfirmationMismatchError extends DomainError {
  constructor(email: string, emailConfirmation: string) {
    super(`Email '${email}' does not match confirmation '${emailConfirmation}'`, ErrorCategory.VALIDATION);
  }
}
