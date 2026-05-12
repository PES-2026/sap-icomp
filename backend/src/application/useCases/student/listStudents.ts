import { ApplicationError } from "@application/errors/applicationError";
import { IStudentRepository } from "@domain/repositories/studentRepository";
import { Result } from "@domain/shared/result";
import { ListStudentDTO, ListStudentResponse } from "@application/dtos/student/listStudentsDto";
import { StudentListParams } from "@domain/repositories/filters/studentFilters";

export class ListStudents {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(dto: ListStudentDTO): Promise<Result<ListStudentResponse, ApplicationError>> {
    const params: StudentListParams = {
      page: dto.page,
      limit: dto.limit,
      filters: dto.filters,
    };

    const result = await this.studentRepository.findAll(params);

    return Result.ok<ListStudentResponse>(result);
  }
}
