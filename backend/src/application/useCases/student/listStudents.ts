import { ApplicationError } from "@application/errors/applicationError";
import { IStudentRepository } from "@domain/repositories/studentRepository";
import { Result } from "@domain/shared/result";
import { ListStudentDTO, ListStudentRequest, ListStudentResponse } from "@application/dtos/student/listStudentsDto";

export class ListStudents {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(dto: ListStudentDTO): Promise<Result<ListStudentResponse, ApplicationError>> {
    const params: ListStudentRequest = {
      page: dto.page,
      limit: dto.limit,
      filters: dto.filters,
    };

    const result = await this.studentRepository.findAll(params);

    return Result.ok<ListStudentResponse>({
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      items: result.items.map((item) => ({
        id: item.id,
        name: item.name,
        enrollmentId: item.enrollmentId,
        email: item.email,
        phoneNumber: item.phoneNumber,
        course: item.course,
      })),
    });
  }
}
