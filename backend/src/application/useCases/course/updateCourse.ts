import { ApplicationError } from "@application/errors/applicationError";
import { CourseAlreadyExistsError } from "@application/errors/course/courseAlreadyExistsError";
import { CourseNotFoundError } from "@application/errors/course/courseNotFoundError";
import { ProfessorNotFoundError } from "@application/errors/professor/professorNotFoundError";
import { Course, CoursePropsVO } from "@domain/entities/course";
import { DomainError } from "@domain/errors/domainError";
import { ICourseRepository } from "@domain/repositories/courseRepository";
import { Result } from "@domain/shared/result";
import { CourseName } from "@domain/valueObjects/course/courseName";
import { AcronymVO } from "@domain/valueObjects/shared/acronym";
import { ExternalIdVO } from "@domain/valueObjects/shared/externalId";

import { UpdateCourseDTO, UpdateCourseResponse } from "../../dtos/course/updateCourseDto";

export class UpdateCourse {
  constructor(private readonly repository: ICourseRepository) {}

  async execute(dto: UpdateCourseDTO): Promise<Result<UpdateCourseResponse, DomainError | ApplicationError>> {
    const course = await this.repository.findById(dto.externalId);
    if (!course) return Result.fail<UpdateCourseResponse>(new CourseNotFoundError(dto.externalId));

    const courseEntity = Course.rehydrate({
      courseId: course.id,
      name: course.name,
      acronym: course.acronym,
      coordinatorId: course.coordinatorId,
    });

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

    const props: Partial<CoursePropsVO> = {};

    if (dto.name !== undefined) {
      const result = CourseName.create(dto.name);
      if (result.isFailure) return Result.fail<UpdateCourseResponse>(result.error!);
      props.name = result.getValue();
    }

    if (dto.acronym !== undefined) {
      const result = AcronymVO.create(dto.acronym);
      if (result.isFailure) return Result.fail<UpdateCourseResponse>(result.error!);
      props.acronym = result.getValue();
    }

    if (dto.coordinatorId !== undefined) {
      const result = ExternalIdVO.from(dto.coordinatorId);
      if (result.isFailure) return Result.fail<UpdateCourseResponse>(result.error!);
      props.coordinatorId = result.getValue();
    }

    courseEntity.update(props);

    await this.repository.update(courseEntity);

    return Result.ok<UpdateCourseResponse>({
      externalId: courseEntity.externalId.value,
      name: courseEntity.name.value,
      acronym: courseEntity.acronym.value,
      coordinatorId: courseEntity.coordinatorId?.value,
    });
  }
}
