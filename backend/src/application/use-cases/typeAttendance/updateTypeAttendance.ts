import {
  UpdateTypeAttendanceDTO,
  UpdateTypeAttendanceResponse,
} from "../../../application/dtos/typeAttendance/updateTypeAttendance.dto";
import { ITypeAttendanceRepository } from "../../../domain/repositories/typeAttendanceRepository";
import { TypeAttendance } from "../../../domain/entities/typeAttendance";
export class UpdateTypeAttendance {
  constructor(
    private readonly typeAttendanceRepository: ITypeAttendanceRepository,
  ) {}

  async execute(
    dto: UpdateTypeAttendanceDTO,
  ): Promise<UpdateTypeAttendanceResponse> {
    const typeAttendance = TypeAttendance.update(dto);
    const result = await this.typeAttendanceRepository.update(typeAttendance);

    return result;
  }
}
