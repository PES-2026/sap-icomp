import { PaginationParams } from "@domain/shared/pagination";

export interface ListTypeAttendanceFilters {
  name?: string;
}

export type TypeAttedanceParams = PaginationParams<"filters", ListTypeAttendanceFilters>;
