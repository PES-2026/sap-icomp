import { BaseItem } from "@domain/shared/item";
import { PaginatedResult } from "@domain/shared/pagination";

export interface AttendanceTypeResult extends BaseItem {
  name: string;
}

export type PaginatedAttendanceTypeResult = PaginatedResult<AttendanceTypeResult>;
