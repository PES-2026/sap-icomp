import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class ReportOwnershipError extends ApplicationError {
  constructor(role: string) {
    super(`The user with role '${role}' is not the owner of the report`, ErrorCategory.BUSINESS_RULE);
  }
}
