import { ErrorCategory } from "@domain/errors/domainError";

import { ApplicationError } from "../applicationError";

export class DiagnosisCidAlreadyExistsError extends ApplicationError {
  constructor(cid: string) {
    super(`The diagnosis CID '${cid}' already exists`, ErrorCategory.BUSINESS_RULE);
  }
}
