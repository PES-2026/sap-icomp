import { DomainError, ErrorCategory } from "../domainError";

export class InvalidStudentDataError extends DomainError {
  constructor(reason: string) {
    super(`Invalid student data provided. Reason: ${reason}`, ErrorCategory.VALIDATION);
  }
}
