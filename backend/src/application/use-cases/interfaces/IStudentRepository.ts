import { Student } from "../../../domain/entities/student.js";

export type SaveStudentParams = {
  student: Student;
};

export interface IStudentRepository {
  existsByEmail(email: string): Promise<boolean>;
  existsByEnrollmentId(enrollmentId: string): Promise<boolean>;
  save(params: SaveStudentParams): Promise<Student>;
}
