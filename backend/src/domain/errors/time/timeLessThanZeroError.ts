import { DomainError, ErrorCategory } from "../domainError";

export class TimeLessThanZeroError extends DomainError {
  constructor(time: number) {
    super(`Time cannot be less than zero. Provided time: ${time}.`, ErrorCategory.VALIDATION);
  }
}
