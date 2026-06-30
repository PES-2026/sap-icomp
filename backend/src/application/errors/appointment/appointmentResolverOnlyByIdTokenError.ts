import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class AppointmentResolverOnlyByIdTokenError extends ApplicationError {
  constructor() {
    super(
      `Appointment Resolver can be made using only ID or a Token, please verify your input.`,
      ErrorCategory.VALIDATION,
    );
  }
}
