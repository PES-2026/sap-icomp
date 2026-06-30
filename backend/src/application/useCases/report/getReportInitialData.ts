import { GetInitialDataDTO } from "@application/dtos/report/getInitialDataDto";
import { GetReportInitialDataResponseDTO } from "@application/dtos/report/getReportInitialDataDto";
import { ApplicationError } from "@application/errors/applicationError";
import { StudentNotFoundError } from "@application/errors/student/studentNotFoundError";
import { IStudentRepository } from "@domain/repositories/studentRepository";
import { Result } from "@domain/shared/result";

export class GetReportInitialData {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(dto: GetInitialDataDTO): Promise<Result<GetReportInitialDataResponseDTO, ApplicationError>> {
    const student = await this.studentRepository.findByUUID(dto.studentId);

    if (!student) {
      return Result.fail<GetReportInitialDataResponseDTO>(new StudentNotFoundError(dto.studentId));
    }

    return Result.ok<GetReportInitialDataResponseDTO>({
      potential: student.potential ?? "",
      difficulties: student.difficulties ?? "",
    });
  }
}
