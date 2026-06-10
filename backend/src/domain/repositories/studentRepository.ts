import { Student } from "../entities/student";

import { StudentListParams } from "./filters/studentFilters";
import { PaginatedStudentResult, StudentResult } from "./results/studentResult";

export interface IStudentRepository {
  findAll(params: StudentListParams): Promise<PaginatedStudentResult>;
  existsByEmail(email: string): Promise<boolean>;
  existsByEnrollmentId(enrollmentId: string): Promise<boolean>;
  findByEnrollmentId(enrollmentId: string): Promise<StudentResult | null>;
  save(student: Student): Promise<void>;
  update(student: Student): Promise<void>;
  existsByUUID(externaID: string): Promise<boolean>;
  findByUUID(externaID: string): Promise<StudentResult | null>;
  disableByUUID(externalId: string): Promise<boolean>;
}
