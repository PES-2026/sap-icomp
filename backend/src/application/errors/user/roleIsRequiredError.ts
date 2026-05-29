import { DomainError, ErrorCategory } from "@domain/errors/domainError";

export class RoleIsRequiredError extends DomainError {
  constructor() {
    super("Role is required", ErrorCategory.VALIDATION);
  }
}
