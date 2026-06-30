import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class RequestedAppointmentUncoveredError extends ApplicationError {
  constructor(pedagogueId: string, start: string, end: string, date: string) {
    super(
      `The appointment do not cover the entire requested duration, for the pedagogue '${pedagogueId}', to the start: '${start}',\n
       end: '${end}' found for the requested date: '${date}'.`,
      ErrorCategory.BUSINESS_RULE,
    );
  }
}
