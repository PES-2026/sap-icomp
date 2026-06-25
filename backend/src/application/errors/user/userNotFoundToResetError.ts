import { ApplicationError } from "@application/errors/applicationError";
import { ErrorCategory } from "@domain/errors/domainError";

export class UserNotFoundToResetError extends ApplicationError {
  constructor() {
    super("User not found for this reset token", ErrorCategory.NOT_FOUND);
  }
}
