import { DomainError, ErrorCategory } from "@domain/errors/domainError";

export class OldPasswordNotDefinedError extends DomainError {
  constructor() {
    super("Old password is not defined", ErrorCategory.VALIDATION);
  }
}
