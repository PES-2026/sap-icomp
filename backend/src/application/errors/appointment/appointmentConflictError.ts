import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class AppointmentConflictError extends ApplicationError {
  constructor(pedagogueId: string, start: string, end: string, date: string) {
    super(
      `A availability already exists for pedagogue ${pedagogueId} between ${start} and ${end} on ${date}.`,
      ErrorCategory.BUSINESS_RULE,
    );
  }
}
