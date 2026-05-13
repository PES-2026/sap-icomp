import { DomainError, ErrorCategory } from "../domainError";

export class InvalidCidFormatError extends DomainError {
  constructor(cid: string) {
    super(
      `Invalid CID format: ${cid}. It must follow the international standard (e.g., F90.0).`,
      ErrorCategory.VALIDATION,
    );
  }
}
