import { ErrorCategory, DomainError } from "../domainError";

export class RegistrationAlreadyExistError extends DomainError {
  constructor(registration: string) {
    super(`The registration number '${registration}' already exists.`, ErrorCategory.BUSINESS_RULE);
  }
}
