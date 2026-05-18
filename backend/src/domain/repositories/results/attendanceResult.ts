import { BaseItem } from "@domain/shared/item";
import { PaginatedResult, PaginationParams } from "@domain/shared/pagination";

import { AttendanceTypeResult } from "./attendanceTypeResult";

export interface AttendanceResult extends BaseItem {
  studentId: string;
  date: Date;
  type: AttendanceTypeResult;
  demand: string;
  generalObservations: string;
}

export type PaginatedAttendanceResult = PaginatedResult<AttendanceResult>;

export type FindByStudentParams = PaginationParams<"studentId", string>;
