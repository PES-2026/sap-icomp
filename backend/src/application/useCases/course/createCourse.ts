import { ApplicationError } from "@application/errors/applicationError";
import { CourseAlreadyExistsError } from "@application/errors/course/courseAlreadyExistsError";
import { ProfessorNotFoundError } from "@application/errors/professor/professorNotFoundError";
import { Course } from "@domain/entities/course";
import { DomainError } from "@domain/errors/domainError";
import { ICourseRepository } from "@domain/repositories/courseRepository";
import { Result } from "@domain/shared/result";

import { CreateCourseDTO, CreateCourseResponse } from "../../dtos/course/createCourseDto";

export class CreateCourse {
  constructor(private readonly repository: ICourseRepository) {}

  async execute(dto: CreateCourseDTO): Promise<Result<CreateCourseResponse, DomainError | ApplicationError>> {
    const courseByName = await this.repository.findByName(dto.name);
    if (courseByName) {
      return Result.fail<CreateCourseResponse>(new CourseAlreadyExistsError("name", dto.name));
    }

    const courseByAcronym = await this.repository.findByAcronym(dto.acronym);
    if (courseByAcronym) {
      return Result.fail<CreateCourseResponse>(new CourseAlreadyExistsError("acronym", dto.acronym));
    }

    if (dto.coordinatorId) {
      const professorExists = await this.repository.existsProfessorById(dto.coordinatorId);
      if (!professorExists) {
        return Result.fail<CreateCourseResponse>(new ProfessorNotFoundError(dto.coordinatorId));
      }
    }

    const courseEntityOrError = Course.create(dto.name, dto.acronym, dto.coordinatorId);

    if (courseEntityOrError.isFailure) {
      return Result.fail<CreateCourseResponse>(courseEntityOrError.error!);
    }

    const courseEntity = courseEntityOrError.getValue();
    await this.repository.save(courseEntity);

    return Result.ok<CreateCourseResponse>({
      id: courseEntity.externalId.value,
      name: courseEntity.name.value,
      acronym: courseEntity.acronym.value,
      coordinatorId: courseEntity.coordinatorId?.value ?? "",
    });
  }
}
