import { Course } from "../entities/course";
export interface ICourseRepository {
  save(course: Course): Promise<void>;
  update(course: Course): Promise<void>;
}
