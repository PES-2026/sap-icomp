import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class MaxAttendanceTimeNotDefinedError extends ApplicationError {
  constructor() {
    super(
      "The maximum attendance time for the pedagogue is not defined. Please, verify with the pedagogue",
      ErrorCategory.BUSINESS_RULE,
    );
  }
}
