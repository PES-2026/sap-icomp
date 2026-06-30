import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class ReportNotFoundError extends ApplicationError {
  constructor(id: string) {
    super(`The report with the ID: '${id}' not found in the database`, ErrorCategory.BUSINESS_RULE);
  }
}
