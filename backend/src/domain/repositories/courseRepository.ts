import { CourseVO } from "@domain/entities/course";
import { ListCourseRequest, ListCourseResponse } from "@domain/repositories/filters/courseFilters";
import { CourseItem } from "@domain/repositories/results/courseResult";

export interface ICourseRepository {
  save(course: CourseVO): Promise<void>;
  update(course: CourseVO): Promise<void>;
  findAll(params: ListCourseRequest): Promise<ListCourseResponse>;
  findById(id: string): Promise<CourseItem | null>;
  findByName(name: string): Promise<CourseItem | null>;
  findByAcronym(acronym: string): Promise<CourseItem | null>;
  remove(id: string): Promise<void>;
  existsProfessorById(id: string): Promise<boolean>;
  existsByExternalId(id: string): Promise<boolean>;
}
