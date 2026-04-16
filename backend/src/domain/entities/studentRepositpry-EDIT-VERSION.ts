import { Student } from "./student.js";
export type SaveStudentParams = {
  student: Student;
};

export interface IStudentRepository {
  existsByEmail(email: string): Promise<boolean>;
  existsByEnrollmentId(enrollmentId: string): Promise<boolean>;
  save(params: SaveStudentParams): Promise<Student>;
  existsByUUID(externaID: string): Promise<boolean>;
  findByUUID(externaID: string): Promise<Student | null>;
}
