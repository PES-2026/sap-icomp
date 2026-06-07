import { BaseItem } from "@domain/shared/item";
import { PaginatedResult, PaginationParams } from "@domain/shared/pagination";

import { AttendanceTypeResult } from "./attendanceTypeResult";
import { StudentResult } from "./studentResult";

export interface AttendanceResult extends BaseItem {
  student: StudentResult;
  date: Date;
  type: AttendanceTypeResult;
  demand: string;
  generalObservations: string;
  status: string;
  token?: string | undefined;
}

export type PaginatedAttendanceResult = PaginatedResult<AttendanceResult>;

export type FindByStudentParams = PaginationParams<"studentId", string>;
