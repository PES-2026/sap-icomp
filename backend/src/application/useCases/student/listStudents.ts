import { ListStudentDTO } from "@application/dtos/student/listStudentsDto";
import { ApplicationError } from "@application/errors/applicationError";
import { StudentListParams } from "@domain/repositories/filters/studentFilters";
import { PaginatedStudentResult } from "@domain/repositories/results/studentResult";
import { IStudentRepository } from "@domain/repositories/studentRepository";
import { Result } from "@domain/shared/result";

export class ListStudents {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(dto: ListStudentDTO): Promise<Result<PaginatedStudentResult, ApplicationError>> {
    const params: StudentListParams = {
      page: dto.page,
      limit: dto.limit,
      filters: dto.filters,
    };

    const result = await this.studentRepository.findAll(params);

    return Result.ok<PaginatedStudentResult>(result);
  }
}
