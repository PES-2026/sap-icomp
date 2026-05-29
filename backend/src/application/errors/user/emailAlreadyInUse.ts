import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class EmailAlreadyInUseError extends ApplicationError {
  constructor(email: string) {
    super(`The email "${email}" is already in use by another account`, ErrorCategory.BUSINESS_RULE);
  }
}
