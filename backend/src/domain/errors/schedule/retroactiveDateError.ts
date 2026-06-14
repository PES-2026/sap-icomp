import { DomainError, ErrorCategory } from "../domainError";

export class RetroactiveDateError extends DomainError {
  constructor() {
    super("This date is in the past and cannot be used for scheduling.", ErrorCategory.BUSINESS_RULE);
  }
}
