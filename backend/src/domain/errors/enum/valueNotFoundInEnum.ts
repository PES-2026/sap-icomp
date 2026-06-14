import { DomainError, ErrorCategory } from "../domainError";

export class ValueNotFoundInEnumError extends DomainError {
  constructor(value: string, enumName: string) {
    super(`The value '${value}' is not valid for enum ${enumName}`, ErrorCategory.VALIDATION);
  }
}
