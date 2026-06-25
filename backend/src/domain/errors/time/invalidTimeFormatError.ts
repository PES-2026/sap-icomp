import { DomainError, ErrorCategory } from "../domainError";

export class InvalidTimeFormatError extends DomainError {
  constructor(time: string) {
    super(`Invalid time format: ${time}. Expected HH:mm`, ErrorCategory.VALIDATION);
  }
}
