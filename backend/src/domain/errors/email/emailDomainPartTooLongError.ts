import { DomainError, ErrorCategory } from "../domainError";

export class EmailDomainPartTooLongError extends DomainError {
  constructor(part: string) {
    super(
      `The email domain part '${part}' is too long. Maximum allowed is 63 characters per part.`,
      ErrorCategory.VALIDATION,
    );
  }
}
