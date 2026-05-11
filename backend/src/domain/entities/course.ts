import { CourseName } from "../valueObjects/course/courseName";
import { Acronym } from "../valueObjects/course/acronym";
import { ProfessorId } from "../valueObjects/professor/professorId";
export class Course {
  constructor(
    readonly name: CourseName,
    readonly acronym: Acronym,
    readonly coordenatorId?: ProfessorId,
  ) {}
  static create(name: string, acronym: string, coordenatorId?: string): Course {
    const courseName = CourseName.create(name);
    const c_acronym = Acronym.create(acronym);
    const c_coordenatorId = coordenatorId
      ? ProfessorId.reutilise(coordenatorId)
      : undefined;
    return new Course(courseName, c_acronym, c_coordenatorId);
  }
}
