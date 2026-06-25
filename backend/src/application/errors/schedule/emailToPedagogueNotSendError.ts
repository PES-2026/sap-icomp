import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class EmailToPedagogueNotSendError extends ApplicationError {
  constructor() {
    super(
      `Something went wrong to send the e-mail to the pegagogue. Please, try again or contact an administrator`,
      ErrorCategory.VALIDATION,
    );
  }
}
