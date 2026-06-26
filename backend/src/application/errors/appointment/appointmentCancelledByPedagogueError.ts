import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class AppointmentCancelledByPedagogueError extends ApplicationError {
  constructor(id: string, pedagogueId: string) {
    super(`Appointment with ID ${id} was cancelled by pedagogue: '${pedagogueId}'.`, ErrorCategory.BUSINESS_RULE);
  }
}
