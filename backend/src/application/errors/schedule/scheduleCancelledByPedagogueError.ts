import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class ScheduleCancelledByPedagogueError extends ApplicationError {
  constructor(id: string, pedagogueId: string) {
    super(`Schedule with ID ${id} was cancelled by pedagogue: '${pedagogueId}'.`, ErrorCategory.BUSINESS_RULE);
  }
}
