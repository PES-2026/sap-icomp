import { DomainError, ErrorCategory } from "@domain/errors/domainError";

export class PedagogueRegistrationNumberAlreadyExistsError extends DomainError {
  constructor(registrationNumber: string) {
    super(`Registration number ${registrationNumber} is already registered for a pedagogue`, ErrorCategory.VALIDATION);
  }
}
