import { DomainError, ErrorCategory } from "../domainError";

export class NameSizeError extends DomainError {
  constructor() {
    super("Invalid name, it must have between 5 and 255 characters", ErrorCategory.BUSINESS_RULE);
  }
}
