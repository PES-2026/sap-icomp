import { Acronym } from "../valueObjects/course/acronym";
import { CourseName } from "../valueObjects/course/courseName";
import { ProfessorId } from "../valueObjects/professor/professorId";
import { ExternalIdVO } from "../valueObjects/shared/externalId";
export class Course {
  constructor(
    readonly externalId: ExternalIdVO,
    readonly name: CourseName,
    readonly acronym: Acronym,
    readonly coordenatorId?: ProfessorId,
  ) {}
  static create(name: string, acronym: string, coordenatorId?: string): Course {
    const externalId = ExternalIdVO.create();
    const courseName = CourseName.create(name);
    const c_acronym = Acronym.create(acronym);
    const c_coordenatorId = coordenatorId ? ProfessorId.reutilise(coordenatorId) : undefined;
    return new Course(externalId, courseName, c_acronym, c_coordenatorId);
  }
  static update(externalId: string, name: string, acronym: string, coordenatorId?: string): Course {
    const courseExternalId = ExternalIdVO.from(externalId);
    const courseName = CourseName.create(name);
    const c_acronym = Acronym.create(acronym);
    const c_coordenatorId = coordenatorId ? ProfessorId.reutilise(coordenatorId) : undefined;
    return new Course(courseExternalId, courseName, c_acronym, c_coordenatorId);
  }
}
