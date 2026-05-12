import { Student } from "../entities/student";

import { StudentListParams } from "./filters/studentFilters";

// Domain representation of a paginated list of students
export interface PaginatedStudentResult {
  data: Student[];
  total: number;
}

export interface IStudentRepository {
  findAll(params: StudentListParams): Promise<PaginatedStudentResult>;
  existsByEmail(email: string): Promise<boolean>;
  existsByEnrollmentId(enrollmentId: string): Promise<boolean>;
  save(student: Student): Promise<void>;
  existsByUUID(externaID: string): Promise<boolean>;
  findByUUID(externaID: string): Promise<Student | null>;
  disableByUUID(externalId: string): Promise<boolean>;
}
