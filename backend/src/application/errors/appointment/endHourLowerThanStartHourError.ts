import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class EndHourLowerThanStartHourError extends ApplicationError {
  constructor(startHour: number, endHour: number) {
    super(
      `The end hour must be greather than the start hour. The actual values are 'startHour: ${startHour}', 'endHour: ${endHour}'.`,
      ErrorCategory.VALIDATION,
    );
  }
}
