import { DomainError, ErrorCategory } from "../domainError";

export class AcronymTooShortError extends DomainError {
  constructor(length: number) {
    super(`Acronym is too short, minimum 1 character. Provided length: ${length}.`, ErrorCategory.VALIDATION);
  }
}
