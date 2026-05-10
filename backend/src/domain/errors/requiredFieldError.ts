import { DomainError, ErrorCategory } from "./domainError";

export class RequiredFieldError extends DomainError {
  constructor(field: string) {
    super(`Invalid value for'${field}': it must be non-empty`, ErrorCategory.VALIDATION);
  }
}
