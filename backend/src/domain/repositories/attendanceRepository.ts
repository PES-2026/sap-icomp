import { Attendance } from "../entities/attendance";

export interface IAttendanceRepository {
  save(attendance: Attendance): Promise<void>;
}
