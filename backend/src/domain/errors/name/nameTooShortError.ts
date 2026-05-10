import { DomainError, ErrorCategory } from "../domainError";

export class NameTooShortError extends DomainError {
  constructor(length: number) {
    super(`Name must be longer than 5 characters. Provided length: ${length}.`, ErrorCategory.VALIDATION);
  }
}
