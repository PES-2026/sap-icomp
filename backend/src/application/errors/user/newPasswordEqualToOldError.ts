import { DomainError, ErrorCategory } from "@domain/errors/domainError";

export class NewPasswordEqualToOldError extends DomainError {
  constructor() {
    super("New password is the same as the old password", ErrorCategory.VALIDATION);
  }
}
