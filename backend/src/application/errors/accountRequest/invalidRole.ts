import { DomainError, ErrorCategory } from "@domain/errors/domainError";

export class InvalidRoleError extends DomainError {
  constructor(role: string) {
    super(`Invalid role provided: ${role}`, ErrorCategory.VALIDATION);
  }
}
