import { DomainError, ErrorCategory } from "../domainError";

export class CidTooShortError extends DomainError {
  constructor(length: number) {
    super(`CID must be longer than 2 characters. Provided length: ${length}.`, ErrorCategory.VALIDATION);
  }
}
