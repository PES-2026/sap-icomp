import { Student } from "../../entities/student";

export interface IStudentRepository {
  save(student: Student): Promise<void>;
}
