import { CreateTypeAttendanceDto } from "../../application/dtos/typeAttendance/createTypeAttendance.dto";

export interface ITypeAttendanceRepository {
  save(typeAttendance: CreateTypeAttendanceDto): Promise<void>;
}
