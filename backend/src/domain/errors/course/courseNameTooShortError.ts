import { DomainError, ErrorCategory } from "../domainError";

export class CourseNameTooShortError extends DomainError {
  constructor(length: number) {
    super(`Course name is too short, minimum 3 characters. Provided length: ${length}.`, ErrorCategory.VALIDATION);
  }
}
