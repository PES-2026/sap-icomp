import { DomainError, ErrorCategory } from "../domainError";

export class RegistrationOnlyNumberError extends DomainError {
  constructor(registration: string) {
    super(`Registration number '${registration}' contains non-numeric characters.`, ErrorCategory.VALIDATION);
  }
}
