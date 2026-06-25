import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class RemoveReportDTO {
  constructor(public readonly reportId: string) {}

  static create(reportId: any): Result<RemoveReportDTO, RequiredFieldError> {
    if (!reportId || typeof reportId !== "string" || reportId.trim() === "") {
      return Result.fail<RemoveReportDTO>(new RequiredFieldError("reportId"));
    }

    return Result.ok<RemoveReportDTO>(new RemoveReportDTO(reportId));
  }
}
