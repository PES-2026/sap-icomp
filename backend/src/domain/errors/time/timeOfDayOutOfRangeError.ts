import { DomainError, ErrorCategory } from "../domainError";

export class TimeOfDayOutOfRangeError extends DomainError {
  constructor(minutes: number) {
    super(`Time of day must be between 0 and 1439 minutes. Provided: ${minutes}`, ErrorCategory.VALIDATION);
  }
}
