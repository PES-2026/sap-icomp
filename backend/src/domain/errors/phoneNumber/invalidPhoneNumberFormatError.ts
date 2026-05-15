import { DomainError, ErrorCategory } from "../domainError";

export class InvalidPhoneNumberFormatError extends DomainError {
  constructor(phoneNumber: string) {
    super(`The phone number format '${phoneNumber}' is invalid. Expected DDD + 9 digits.`, ErrorCategory.VALIDATION);
  }
}
