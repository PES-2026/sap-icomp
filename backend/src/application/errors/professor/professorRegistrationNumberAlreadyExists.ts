import { DomainError, ErrorCategory } from "@domain/errors/domainError";

export class ProfessorRegistrationNumberAlreadyExistsError extends DomainError {
  constructor(registrationNumber: string) {
    super(
      `Registration number ${registrationNumber} is already registered for a professor`,
      ErrorCategory.BUSINESS_RULE,
    );
  }
}
