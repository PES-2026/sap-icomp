import { Course } from "../../../domain/entities/course";
import { ICourseRepository } from "../../../domain/repositories/courseRepository";
import { CreateCourseDTO, CreateCourseResponse } from "../../dtos/course/createCourse.dto";

export class CreateCourse {
  constructor(private repository: ICourseRepository) {}
  async execute(dto: CreateCourseDTO): Promise<CreateCourseResponse> {
    const course = Course.create(dto.name, dto.acronym, dto.coordinatorId);
    await this.repository.save(course);
    return {
      name: course.name.value,
      acronym: course.acronym.value,
      coordinatorId: course.coordenatorId?.value,
    };
  }
}
