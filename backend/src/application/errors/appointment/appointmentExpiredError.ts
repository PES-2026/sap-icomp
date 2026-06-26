import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class AppointmentExpiredError extends ApplicationError {
  constructor(id: string) {
    super(`Appointment with ID ${id} is expired.`, ErrorCategory.BUSINESS_RULE);
  }
}
