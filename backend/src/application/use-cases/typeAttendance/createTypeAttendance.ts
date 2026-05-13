import { reateTypeAttendanceDto } from "../dtos/typeAttendance/createTypeAttendance.dto";
import { ITypeAttendanceRepository } from "../../domain/repositories/typeAttendanceRepository";
import { TypeAttendance } from "../../domain/entities/typeAttendance";
import { CreateTypeAttendanceDto } from "../../dtos/typeAttendance/createTypeAttendance.dto";

export class CreateTypeAttendance {
  constructor(private typeAttendanceRepository: ITypeAttendanceRepository) {}

  async execute(dto: CreateTypeAttendanceDto): Promise<TypeAttendance> {
    const typeAttendance = TypeAttendance.create(dto);
    await this.typeAttendanceRepository.save(typeAttendance);
    return typeAttendance;
  }
}
