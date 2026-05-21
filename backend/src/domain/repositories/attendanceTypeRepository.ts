import { AttendanceType } from "@domain/entities/attendanceType";

import { ListAttendanceTypeParams } from "./filters/attendanceTypeFilters";
import { AttendanceTypeResult, PaginatedAttendanceTypeResult } from "./results/attendanceTypeResult";

export interface IAttendanceTypeRepository {
  save(typeAttendance: AttendanceType): Promise<void>;
  findById(id: string): Promise<AttendanceTypeResult | null>;
  findByName(name: string): Promise<AttendanceTypeResult | null>;
  findAll(params: ListAttendanceTypeParams): Promise<PaginatedAttendanceTypeResult>;
  update(typeAttendance: AttendanceType): Promise<void>;
  remove(id: string): Promise<void>;
}
