import { ErrorCategory, DomainError } from "../domainError";

export class RoleInvalidError extends DomainError {
  constructor(role: string) {
    super(`Invalid role: ${role}.`, ErrorCategory.VALIDATION);
  }
}
