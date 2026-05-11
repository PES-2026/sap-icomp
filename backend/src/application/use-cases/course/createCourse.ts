import { Course } from "../../../domain/entities/course";
import {
  CreateCourseDTO,
  CreateCourseResponse,
} from "../../dtos/course/createCourse.dto";
import { ICourseRepository } from "../../../domain/repositories/courseRepository";

export class CreateCourse {
  constructor(private repository: ICourseRepository) {}
  async execute(dto: CreateCourseDTO): Promise<CreateCourseResponse> {
    const course = Course.create(dto.name, dto.acronym, dto.coordinatorId);
    await this.repository.save(course);
    return {
      externalId: course.externalId.value,
      name: course.name.value,
      acronym: course.acronym.value,
      coordinatorId: course.coordenatorId?.value,
    };
  }
}
