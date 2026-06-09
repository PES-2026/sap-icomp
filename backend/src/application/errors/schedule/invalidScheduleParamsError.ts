import { ApplicationError } from "@application/errors/applicationError";
import { ErrorCategory } from "@domain/errors/domainError";

export class InvalidScheduleParamsError extends ApplicationError {
  constructor(message: string) {
    super(message, ErrorCategory.BUSINESS_RULE);
  }
}
