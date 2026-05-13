import { ICourseRepository } from "../../../domain/repositories/courseRepository";
import {
  ListCourseDTO,
  ListCourseResponse,
  ListCourseRequest,
} from "../../dtos/course/listCourse.dto";

export class ListCourse {
  constructor(private repository: ICourseRepository) {}
  async execute(dto: ListCourseDTO): Promise<ListCourseResponse> {
    const params: ListCourseRequest = {
      page: dto.page,
      limit: dto.limit,
      filters: dto.filters,
    };

    return this.repository.findAll(params);
  }
}
