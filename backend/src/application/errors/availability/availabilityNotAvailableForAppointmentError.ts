import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class AvailabilityNotAvailableForAppointmentError extends ApplicationError {
  constructor(slotId: string) {
    super(`Availability not available for appointment, id: ${slotId}.`, ErrorCategory.BUSINESS_RULE);
  }
}
