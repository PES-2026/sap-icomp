import { ApplicationError } from "@application/errors/applicationError";
import { CourseNotFoundError } from "@application/errors/course/courseNotFoundError";
import { ICourseRepository } from "@domain/repositories/courseRepository";
import { CourseItem } from "@domain/repositories/results/courseResult";
import { Result } from "@domain/shared/result";

import { CourseByIdDTO } from "../../dtos/course/courseByIdDto";

export class CourseById {
  constructor(private readonly repository: ICourseRepository) {}

  async execute(dto: CourseByIdDTO): Promise<Result<CourseItem, ApplicationError>> {
    const course = await this.repository.findById(dto.id);

    if (!course) {
      return Result.fail<CourseItem>(new CourseNotFoundError(dto.id));
    }

    return Result.ok<CourseItem>(course);
  }
}
