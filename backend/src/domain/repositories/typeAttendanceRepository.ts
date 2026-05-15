import { TypeAttendance } from "@domain/entities/typeAttendance";

import { ListTypeAttendanceFilters } from "./filters/typeAttendanceFilters";
import { PaginatedTypeAttendanceResult, TypeAttendanceResult } from "./results/typeAttendanceResult";

export interface ITypeAttendanceRepository {
  save(typeAttendance: TypeAttendance): Promise<void>;
  findById(id: string): Promise<TypeAttendanceResult | null>;
  findByName(name: string): Promise<TypeAttendanceResult | null>;
  findAll(params: ListTypeAttendanceFilters): Promise<PaginatedTypeAttendanceResult>;
  update(typeAttendance: TypeAttendance): Promise<void>;
  remove(id: string): Promise<void>;
}
