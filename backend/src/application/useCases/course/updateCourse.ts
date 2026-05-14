import { ICourseRepository } from "../../../domain/repositories/courseRepository";
import { UpdateCourseDTO, UpdateCourseResponse } from "../../dtos/course/updateCourse.dto";
import { Course } from "../../../domain/entities/course";

export class UpdateCourse {
  private readonly courseRepo: ICourseRepository;

  constructor(repository: ICourseRepository) {
    this.courseRepo = repository;
  }

  async execute(dto: UpdateCourseDTO): Promise<UpdateCourseResponse> {
    const course = Course.update(dto.externalId, dto.name, dto.acronym, dto.coordenatorId);
    await this.courseRepo.update(course);

    return {
      externalId: course.externalId.value,
      name: course.name.value,
      acronym: course.acronym.value,
      coordinatorId: course.coordenatorId?.value,
    };
  }
}

import { ICourseRepository } from "../../../domain/repositories/courseRepository";
import { UpdateCourseDTO, UpdateCourseResponse } from "../../dtos/course/updateCourse.dto";
import { Course } from "../../../domain/entities/course";

export class UpdateCourse {
  private readonly courseRepo: ICourseRepository;

  constructor(repository: ICourseRepository) {
    this.courseRepo = repository;
  }

  async execute(dto: UpdateCourseDTO): Promise<UpdateCourseResponse> {
    const course = Course.update(dto.externalId, dto.name, dto.acronym, dto.coordenatorId);
    await this.courseRepo.update(course);

    return {
      externalId: course.externalId.value,
      name: course.name.value,
      acronym: course.acronym.value,
      coordinatorId: course.coordenatorId?.value,
    };
  }
}
