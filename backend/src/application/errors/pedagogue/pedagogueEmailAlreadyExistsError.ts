import { DomainError, ErrorCategory } from "@domain/errors/domainError";

export class PedagogueEmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`Email ${email} already exists`, ErrorCategory.VALIDATION);
  }
}
