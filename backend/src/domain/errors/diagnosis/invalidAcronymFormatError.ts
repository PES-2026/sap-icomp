import { DomainError, ErrorCategory } from "../domainError";

export class InvalidAcronymFormatError extends DomainError {
  constructor(acronym: string) {
    super(`Invalid acronym format: ${acronym}. It must contain only letters and numbers.`, ErrorCategory.VALIDATION);
  }
}
