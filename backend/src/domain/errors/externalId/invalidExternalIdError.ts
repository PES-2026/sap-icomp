import { DomainError, ErrorCategory } from "../domainError";

export class InvalidExternalIdError extends DomainError {
  constructor(value: string) {
    super(`Invalid ExternalId format for: ${value}`, ErrorCategory.VALIDATION);
  }
}
