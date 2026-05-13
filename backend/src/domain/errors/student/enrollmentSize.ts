import { DomainError, ErrorCategory } from "../domainError";

export class EnrollmentSizeError extends DomainError {
  constructor() {
    super("Invalid enrollment, it must have 8 digits", ErrorCategory.BUSSINESS_RULE);
  }
}
