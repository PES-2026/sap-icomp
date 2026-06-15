import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class NoAvailableSlotsError extends ApplicationError {
  constructor(slotId: string) {
    super(`Slot not found for the id: ${slotId}.`, ErrorCategory.BUSINESS_RULE);
  }
}
