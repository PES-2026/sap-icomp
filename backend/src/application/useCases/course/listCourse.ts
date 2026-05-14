import { ListCourseDTO } from "@application/dtos/course/listCourseDto";
import { ICourseRepository } from "@domain/repositories/courseRepository";
import { ListCourseRequest, ListCourseResponse } from "@domain/repositories/filters/courseFilters";
import { Result } from "@domain/shared/result";

export class ListCourse {
  constructor(private readonly repository: ICourseRepository) {}

  async execute(dto: ListCourseDTO): Promise<Result<ListCourseResponse>> {
    const params: ListCourseRequest = {
      page: dto.page,
      limit: dto.limit,
      filters: dto.filters,
    };

    const courses = await this.repository.findAll(params);

    return Result.ok<ListCourseResponse>(courses);
  }
}
