import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class UserNotFoundError extends ApplicationError {
  constructor() {
    super("User not found.", ErrorCategory.NOT_FOUND);
  }
}
