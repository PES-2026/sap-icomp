import { BaseItem } from "@domain/shared/item";
import { PaginatedResult } from "@domain/shared/pagination";

export interface CourseItem extends BaseItem {
  name: string;
  acronym: string;
  coordinatorId: string;
  coordinatorName: string;
}

export type PaginatedCourseResult = PaginatedResult<CourseItem>;
