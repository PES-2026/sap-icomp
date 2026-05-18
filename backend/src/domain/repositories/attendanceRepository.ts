import { Attendance } from "../entities/attendance";

import { AttendanceListParams } from "./filters/attendanceFilters";
import { AttendanceResult, FindByStudentParams, PaginatedAttendanceResult } from "./results/attendanceResult";

export interface IAttendanceRepository {
  save(attendance: Attendance): Promise<void>;
  findAll(params: AttendanceListParams): Promise<PaginatedAttendanceResult>;
  findById(id: string): Promise<AttendanceResult | null>;
  findByStudentId(params: FindByStudentParams): Promise<PaginatedAttendanceResult>;
  update(attendance: Attendance): Promise<void>;
  remove(id: string): Promise<void>;
  existsTypeByUUID(id: string): Promise<boolean>;
  existsAnyPedagogue(): Promise<boolean>;
}
