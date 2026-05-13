import { Student } from "../entities/student.js";

export type SaveStudentParams = {
  student: Student;
};

export interface iStudentRepository {
  existsByEmail(email: string): Promise<boolean>;
  existsByEnrollmentId(enrollmentId: string): Promise<boolean>;
  save(params: SaveStudentParams): Promise<Student>;
  existsByUUID(externaID: string): Promise<boolean>;
  findByUUID(externaID: string): Promise<Student | null>;
  disableByUUID(externalId: string): Promise<boolean>;
}
