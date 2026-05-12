import { PaginatedResult } from "@domain/shared/pagination";
import { Student } from "../entities/student";
import { StudentListParams } from "./filters/studentFilters";

export interface IStudentRepository {
  findAll(params: StudentListParams): Promise<PaginatedResult<Student>>;
  findById(id: string): Promise<Student | null>;
  findByEmail(email: string): Promise<Student | null>;
  existsByEmail(email: string): Promise<boolean>;
  existsByEnrollmentId(enrollmentId: string): Promise<boolean>;
  save(params: Student): Promise<Student>;
  existsByUUID(externaID: string): Promise<boolean>;
  findByUUID(externaID: string): Promise<Student | null>;
  disableByUUID(externalId: string): Promise<boolean>;
}
