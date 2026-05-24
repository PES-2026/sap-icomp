import { DomainError, ErrorCategory } from "@domain/errors/domainError";

export class ProfessorEmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`Email ${email} is already registered for a professor`, ErrorCategory.VALIDATION);
  }
}
