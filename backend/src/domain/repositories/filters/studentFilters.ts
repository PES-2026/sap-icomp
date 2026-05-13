import { PaginationParams } from "@domain/shared/pagination";

export interface ListStudentFilters {
  name?: string;
  enrollment?: string;
  course?: string;
  diganosis?: string;
  lastAttendance?: Date;
}

export type StudentListParams = PaginationParams<"filters", ListStudentFilters>;
