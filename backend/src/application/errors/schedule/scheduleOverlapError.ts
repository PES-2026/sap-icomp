import { ApplicationError } from "@application/errors/applicationError";
import { ErrorCategory } from "@domain/errors/domainError";

export class ScheduleOverlapError extends ApplicationError {
  constructor(message?: string) {
    super(
      message || "The requested schedule slots overlap with existing ones or with each other.",
      ErrorCategory.BUSINESS_RULE,
    );
  }
}
