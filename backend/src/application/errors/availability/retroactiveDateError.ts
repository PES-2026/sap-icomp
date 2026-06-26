import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class RetroactiveDateError extends ApplicationError {
  constructor() {
    super("This date is in the past and cannot be used for scheduling.", ErrorCategory.BUSINESS_RULE);
  }
}
