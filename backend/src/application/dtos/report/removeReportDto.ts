import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";
import { validateStringField } from "@domain/utils/validationUtils";

export class RemoveReportDTO {
  constructor(
    public readonly reportId: string,
    public readonly password: string,
  ) {}

  static create(reportId: any, data: any): Result<RemoveReportDTO, RequiredFieldError> {
    reportId = validateStringField(reportId, "reportId");
    const password = validateStringField(data.password, "password");

    return Result.ok<RemoveReportDTO>(new RemoveReportDTO(reportId, password));
  }
}
