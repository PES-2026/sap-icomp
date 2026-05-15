import { ApplicationError } from "@application/errors/applicationError";
import { CourseAlreadyExistsError } from "@application/errors/course/courseAlreadyExistsError";
import { ProfessorNotFoundError } from "@application/errors/professor/professorNotFoundError";
import { Course } from "@domain/entities/course";
import { DomainError } from "@domain/errors/domainError";
import { ICourseRepository } from "@domain/repositories/courseRepository";
import { Result } from "@domain/shared/result";

import { UpdateCourseDTO, UpdateCourseResponse } from "../../dtos/course/updateCourseDto";

export class UpdateCourse {
  constructor(private readonly repository: ICourseRepository) {}

  async execute(dto: UpdateCourseDTO): Promise<Result<UpdateCourseResponse, DomainError | ApplicationError>> {
    const courseByName = await this.repository.findByName(dto.name);
    if (courseByName && courseByName.id !== dto.externalId) {
      return Result.fail<UpdateCourseResponse>(new CourseAlreadyExistsError("name", dto.name));
    }

    const courseByAcronym = await this.repository.findByAcronym(dto.acronym);
    if (courseByAcronym && courseByAcronym.id !== dto.externalId) {
      return Result.fail<UpdateCourseResponse>(new CourseAlreadyExistsError("acronym", dto.acronym));
    }

    if (dto.coordinatorId) {
      const professorExists = await this.repository.existsProfessorById(dto.coordinatorId);
      if (!professorExists) {
        return Result.fail<UpdateCourseResponse>(new ProfessorNotFoundError(dto.coordinatorId));
      }
    }

    const courseOrError = Course.update(dto.externalId, dto.name, dto.acronym, dto.coordinatorId);

    if (courseOrError.isFailure) {
      return Result.fail<UpdateCourseResponse>(courseOrError.error!);
    }

    const course = courseOrError.getValue();
    await this.repository.update(course);

    return Result.ok<UpdateCourseResponse>({
      externalId: course.externalId.value,
      name: course.name.value,
      acronym: course.acronym.value,
      coordinatorId: course.coordinatorId?.value,
    });
  }
}
