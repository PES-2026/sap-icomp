import { DomainError, ErrorCategory } from "@domain/errors/domainError";

export class RoleRequiredForApprovalError extends DomainError {
  constructor() {
    super("Role is required when approving a user", ErrorCategory.VALIDATION);
  }
}
