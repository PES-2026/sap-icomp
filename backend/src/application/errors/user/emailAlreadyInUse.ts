import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class EmailAlreadyInUseError extends ApplicationError {
  constructor(email: string) {
    super(`This email "${email}" already in use.`, ErrorCategory.BUSINESS_RULE);
  }
}
