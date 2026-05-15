import { DomainError, ErrorCategory } from "../domainError";

export class NameTooLongError extends DomainError {
  constructor(length: number) {
    super(`Name is too long, exceeding 255 characters. Provided length: ${length}.`, ErrorCategory.VALIDATION);
  }
}
