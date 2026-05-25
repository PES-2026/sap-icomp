import { ErrorCategory, DomainError } from "../domainError";

export class UserStatusInvalidError extends DomainError {
  constructor(status: string) {
    super(`Invalid user status: ${status}.`, ErrorCategory.VALIDATION);
  }
}
