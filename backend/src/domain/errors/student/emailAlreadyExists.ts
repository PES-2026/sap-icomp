import { DomainError, ErrorCategory } from "../domainError";

export class EmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`The email '${email}' is already registered.`, ErrorCategory.BUSSINESS_RULE);
  }
}
