import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class SlotNotAvailableForScheduleError extends ApplicationError {
  constructor(slotId: string) {
    super(`Slot not available for schedule, id: ${slotId}.`, ErrorCategory.BUSINESS_RULE);
  }
}
