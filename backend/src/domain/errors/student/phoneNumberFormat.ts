import { DomainError, ErrorCategory } from "../domainError";

export class PhoneNumberFormatError extends DomainError {
  constructor() {
    super("Invalid phone number, it must have area code and 9 digits", ErrorCategory.BUSINESS_RULE);
  }
}
