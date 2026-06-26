import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class NoAvailabilityError extends ApplicationError {
  constructor(slotId: string) {
    super(`Availability not found for the id: ${slotId}.`, ErrorCategory.BUSINESS_RULE);
  }
}
