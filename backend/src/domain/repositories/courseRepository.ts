import { Course } from "../entities/course";
import {
  ListCourseRequest,
  ListCourseResponse,
} from "../../application/dtos/course/listCourse.dto";
export interface ICourseRepository {
  save(course: Course): Promise<void>;
  update(course: Course): Promise<void>;
  findAll(params: ListCourseRequest): Promise<ListCourseResponse>;
}
