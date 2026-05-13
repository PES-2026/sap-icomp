import { DomainError, ErrorCategory } from "../domainError";

export class CidTooLongError extends DomainError {
  constructor(length: number) {
    super(`CID must be shorter than 10 characters. Provided length: ${length}.`, ErrorCategory.VALIDATION);
  }
}
