import { ITypeAttendanceRepository } from "../../../domain/repositories/typeAttendanceRepository";
import {
  TypeAttendanceByIdDTO,
  TypeAttendanceByIdResponse,
} from "../../dtos/typeAttendance/typeAttendanceById.dto";
export class TypeAttendanceById {
  constructor(private repository: ITypeAttendanceRepository) {}

  async execute(dto: TypeAttendanceByIdDTO): Promise<TypeAttendanceByIdResponse> {
    const record = await this.repository.findById(dto.id);
    if (!record) {
      throw new Error(`TypeAttendance not found:'${dto.id}'`);
    }
    return {
      externalId: record.externalId,
      name: record.name,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
