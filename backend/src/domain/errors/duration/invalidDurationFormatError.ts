import { DomainError, ErrorCategory } from "../domainError";

export class InvalidDurationFormatError extends DomainError {
  constructor(time: string) {
    super(`Invalid duration format: ${time}. Expected HH:mm`, ErrorCategory.VALIDATION);
  }
}
