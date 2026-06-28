import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class ListReportsByStudentDTO {
  constructor(public readonly studentId: string) {}

  static create(data: any): Result<ListReportsByStudentDTO, RequiredFieldError> {
    const { studentId } = data;
    if (!studentId || typeof studentId !== "string" || studentId.trim() === "") {
      return Result.fail<ListReportsByStudentDTO>(new RequiredFieldError("studentId"));
    }

    return Result.ok<ListReportsByStudentDTO>(new ListReportsByStudentDTO(studentId));
  }
}
