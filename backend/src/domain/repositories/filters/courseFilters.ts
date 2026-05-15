import { PaginatedResult, PaginationParams } from "@domain/shared/pagination";

import { CourseItem } from "../results/courseResult";

export interface ListCourseFilters {
  name?: string;
  acronym?: string;
}

export type ListCourseRequest = PaginationParams<"filters", ListCourseFilters>;
export type ListCourseResponse = PaginatedResult<CourseItem>;
