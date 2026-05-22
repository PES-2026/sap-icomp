import { ErrorCategory, DomainError } from "../domainError";

export class UserTypeInvalidError extends DomainError {
  constructor(type: string) {
    super(`Invalid user type: ${type}.`, ErrorCategory.VALIDATION);
  }
}
