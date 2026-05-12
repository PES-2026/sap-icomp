import { Student } from "../entities/student";
import { StudentListParams } from "./filters/studentFilters";
import { ListStudentResponse } from "@application/dtos/student/listStudentsDto";

export interface IStudentRepository {
  findAll(params: StudentListParams): Promise<ListStudentResponse>;
  existsByEmail(email: string): Promise<boolean>;
  existsByEnrollmentId(enrollmentId: string): Promise<boolean>;
  save(student: Student): Promise<void>;
  existsByUUID(externaID: string): Promise<boolean>;
  findByUUID(externaID: string): Promise<Student | null>;
  disableByUUID(externalId: string): Promise<boolean>;
}
