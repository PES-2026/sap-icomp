import { DomainError, ErrorCategory } from "../domainError";

export class CourseNameTooLongError extends DomainError {
  constructor(length: number) {
    super(`Course name is too long, exceeding 140 characters. Provided length: ${length}.`, ErrorCategory.VALIDATION);
  }
}
