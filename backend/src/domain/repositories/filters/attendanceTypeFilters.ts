import { PaginationParams } from "@domain/shared/pagination";

export interface ListAttendanceTypeFilters {
  name?: string;
}

export type ListAttendanceTypeParams = PaginationParams<"filters", ListAttendanceTypeFilters>;
