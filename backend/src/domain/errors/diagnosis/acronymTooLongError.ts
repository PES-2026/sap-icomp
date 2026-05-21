import { DomainError, ErrorCategory } from "../domainError";

export class AcronymTooLongError extends DomainError {
  constructor(length: number) {
    super(`Acronym must be shorter than 10 characters. Provided length: ${length}.`, ErrorCategory.VALIDATION);
  }
}
