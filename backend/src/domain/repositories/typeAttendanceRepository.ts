import { TypeAttendance } from "../entities/typeAttendance";

export interface ITypeAttendanceRepository {
  save(typeAttendance: TypeAttendance): Promise<void>;
}
