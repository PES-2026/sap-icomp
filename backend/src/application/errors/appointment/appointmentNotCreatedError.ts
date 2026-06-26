import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class AppointmentNotCreatedError extends ApplicationError {
  constructor(id: string) {
    super(`Appointment with ID ${id} was not created on database'.`, ErrorCategory.VALIDATION);
  }
}
