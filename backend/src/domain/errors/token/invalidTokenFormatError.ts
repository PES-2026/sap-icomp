import { DomainError, ErrorCategory } from "../domainError";

export class InvalidTokenFormatError extends DomainError {
  constructor(token: string) {
    super(`Invalid token format. Provided token: ${token}.`, ErrorCategory.VALIDATION);
  }
}
