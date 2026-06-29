import { ApplicationError } from "@application/errors/applicationError";
import { ErrorCategory } from "@domain/errors/domainError";

export class AvailabilityNotFoundError extends ApplicationError {
  constructor(id: string) {
    super(`Availability not found: '${id}'`, ErrorCategory.BUSINESS_RULE);
  }
}
