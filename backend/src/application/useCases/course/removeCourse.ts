import { ApplicationError } from "@application/errors/applicationError";
import { CourseNotFoundError } from "@application/errors/course/courseNotFoundError";
import { ICourseRepository } from "@domain/repositories/courseRepository";
import { Result } from "@domain/shared/result";

import { RemoveCourseDTO } from "../../dtos/course/removeCourseDto";

export class RemoveCourse {
  constructor(private readonly repository: ICourseRepository) {}

  async execute(dto: RemoveCourseDTO): Promise<Result<void, ApplicationError>> {
    const course = await this.repository.findById(dto.id);

    if (!course) {
      return Result.fail<void>(new CourseNotFoundError(dto.id));
    }

    await this.repository.remove(dto.id);

    return Result.ok<void>();
  }
}
