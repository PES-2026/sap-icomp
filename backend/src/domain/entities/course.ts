import { Result } from "@domain/shared/result";

import { Acronym } from "../valueObjects/course/acronym";
import { CourseName } from "../valueObjects/course/courseName";
import { ProfessorId } from "../valueObjects/professor/professorId";
import { ExternalIdVO } from "../valueObjects/shared/externalId";

export class Course {
  constructor(
    readonly externalId: ExternalIdVO,
    readonly name: CourseName,
    readonly acronym: Acronym,
    readonly coordinatorId?: ProfessorId,
  ) {}

  static create(name: string, acronym: string, coordinatorId?: string): Result<Course> {
    const externalId = ExternalIdVO.create();
    const courseName = CourseName.create(name);
    const courseAcronym = Acronym.create(acronym);
    const courseCoordinatorId = coordinatorId ? ProfessorId.reutilise(coordinatorId) : undefined;

    const results = [externalId, courseName, courseAcronym];

    for (const result of results) {
      if (result.isFailure) {
        return Result.fail<Course>(result.error!);
      }
    }

    return Result.ok<Course>(
      new Course(externalId.getValue(), courseName.getValue(), courseAcronym.getValue(), courseCoordinatorId),
    );
  }

  static update(externalId: string, name: string, acronym: string, coordinatorId?: string): Result<Course> {
    const courseExternalId = ExternalIdVO.from(externalId);
    const courseName = CourseName.create(name);
    const courseAcronym = Acronym.create(acronym);
    const courseCoordinatorId = coordinatorId ? ProfessorId.reutilise(coordinatorId) : undefined;

    const results = [courseExternalId, courseName, courseAcronym];

    for (const result of results) {
      if (result.isFailure) {
        return Result.fail<Course>(result.error!);
      }
    }

    return Result.ok<Course>(
      new Course(courseExternalId.getValue(), courseName.getValue(), courseAcronym.getValue(), courseCoordinatorId),
    );
  }
}
