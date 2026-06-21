import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export class CreateReportDTO {
  constructor(
    public readonly studentId: string,
    public readonly pedagogueId: string,
    public readonly condition: string,
    public readonly potential: string,
    public readonly difficulties: string,
    public readonly recommendation: string,
    public readonly conclusion: string,
  ) {}

  static create(studentId: any, data: any): Result<CreateReportDTO, RequiredFieldError> {
    const { pedagogueId, condition, potential, difficulties, recommendation, conclusion } = data;
    if (!studentId || typeof studentId !== "string" || studentId.trim() === "") {
      return Result.fail<CreateReportDTO>(new RequiredFieldError("studentId"));
    }
    if (!pedagogueId || typeof pedagogueId !== "string" || pedagogueId.trim() === "") {
      return Result.fail<CreateReportDTO>(new RequiredFieldError("pedagogueId"));
    }
    if (!condition || typeof condition !== "string" || condition.trim() === "") {
      return Result.fail<CreateReportDTO>(new RequiredFieldError("condition"));
    }
    if (!potential || typeof potential !== "string" || potential.trim() === "") {
      return Result.fail<CreateReportDTO>(new RequiredFieldError("potential"));
    }
    if (!difficulties || typeof difficulties !== "string" || difficulties.trim() === "") {
      return Result.fail<CreateReportDTO>(new RequiredFieldError("difficulties"));
    }
    if (!recommendation || typeof recommendation !== "string" || recommendation.trim() === "") {
      return Result.fail<CreateReportDTO>(new RequiredFieldError("recommendation"));
    }
    if (!conclusion || typeof conclusion !== "string" || conclusion.trim() === "") {
      return Result.fail<CreateReportDTO>(new RequiredFieldError("conclusion"));
    }

    return Result.ok<CreateReportDTO>(
      new CreateReportDTO(studentId, pedagogueId, condition, potential, difficulties, recommendation, conclusion),
    );
  }
}
