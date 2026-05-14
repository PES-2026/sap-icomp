import { TypeAttendance } from "../entities/typeAttendance";
import { UpdateTypeAttendanceResponse } from "../../application/dtos/typeAttendance/updateTypeAttendance.dto";
import {
  ListTypeAttendanceRequest,
  ListTypeAttendanceResponse,
} from "../../application/dtos/typeAttendance/listTypeAttendance.dto";
import { TypeAttendanceByIdResponse } from "../../application/dtos/typeAttendance/typeAttendanceById.dto";
export interface ITypeAttendanceRepository {
  save(typeAttendance: TypeAttendance): Promise<void>;
  update(typeAttendance: TypeAttendance): Promise<UpdateTypeAttendanceResponse>;

  findAll(
    params: ListTypeAttendanceRequest,
  ): Promise<ListTypeAttendanceResponse>;
  findById(externalId: string): Promise<TypeAttendanceByIdResponse | null>;
  remove(externalId: string): Promise<void>;
}
