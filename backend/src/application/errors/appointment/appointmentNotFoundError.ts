import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class AppointmentNotFoundError extends ApplicationError {
  constructor(id: string) {
    super(`Appointment with ID ${id} was not found. Please verify it!`, ErrorCategory.NOT_FOUND);
  }
}
