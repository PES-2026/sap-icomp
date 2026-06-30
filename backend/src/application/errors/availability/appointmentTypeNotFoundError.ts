import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class AppointmentTypeNotFoundError extends ApplicationError {
  constructor(type: string, supportedValues: string[]) {
    super(
      `Appointment type not found: '${type}', the supported values are: '${supportedValues.join(", ")}'.`,
      ErrorCategory.VALIDATION,
    );
  }
}
