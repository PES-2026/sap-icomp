import { BaseItem } from "@domain/shared/item";
import { PaginatedResult } from "@domain/shared/pagination";

export interface TypeAttendanceResult extends BaseItem {
  name: string;
}

export type PaginatedTypeAttendanceResult = PaginatedResult<TypeAttendanceResult>;
