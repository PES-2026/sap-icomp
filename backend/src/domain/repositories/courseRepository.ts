import { Course } from "../entities/course";
export interface courseRository {
  save(course: Course): Promise<void>;
}
