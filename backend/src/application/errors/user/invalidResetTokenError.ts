import { ApplicationError } from "@application/errors/applicationError";
import { ErrorCategory } from "@domain/errors/domainError";

export class InvalidResetTokenError extends ApplicationError {
  constructor() {
    super("Invalid or expired reset token", ErrorCategory.VALIDATION);
  }
}
