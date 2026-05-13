import { TypeAttendance } from "../entities/typeAttendance";
import { UpdateTypeAttendanceResponse } from "../../application/dtos/typeAttendance/updateTypeAttendance.dto";
export interface ITypeAttendanceRepository {
  save(typeAttendance: TypeAttendance): Promise<void>;
  update(typeAttendance: TypeAttendance): Promise<UpdateTypeAttendanceResponse>;
}
