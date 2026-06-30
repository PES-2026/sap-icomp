import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class EmailToStudentNotSendError extends ApplicationError {
  constructor() {
    super(
      `Something went wrong to send the e-mail to the student. Please, try again or contact an administrator`,
      ErrorCategory.VALIDATION,
    );
  }
}
