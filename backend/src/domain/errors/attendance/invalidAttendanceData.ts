import { DomainError, ErrorCategory } from "../domainError";

export class InvalidAttendanceDataError extends DomainError {
  constructor(reason: string) {
    super(`Invalid attendance data provided. Reason: ${reason}`, ErrorCategory.VALIDATION);
  }
}
