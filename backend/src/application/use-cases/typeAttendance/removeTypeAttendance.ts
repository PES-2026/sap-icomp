import { RemoveTypeAttendanceDTO } from "../../dtos/typeAttendance/removeTypeAttendance.dto";
import { ITypeAttendanceRepository } from "../../../domain/repositories/typeAttendanceRepository";
import { TypeAttendance } from "../../../domain/entities/typeAttendance";
import { TypeAttendanceByIdResponse } from "../../dtos/typeAttendance/typeAttendanceById.dto";
import { Name as NameVO } from "../../../domain/valueObjects/typeAttendance/name";
import { ExternalIdVO } from "../../../domain/valueObjects//shared/externalId";
export class RemoveTypeAttendance {
  constructor(private repository: ITypeAttendanceRepository) {}

  async execute(dto: RemoveTypeAttendanceDTO): Promise<void> {
    const record: TypeAttendanceByIdResponse | null =
      await this.repository.findById(dto.externalId.value);
    if (!record) {
      throw new Error(`TypeAttendance not found:'${dto.externalId.value}'`);
    }
    const typeAttendance = new TypeAttendance(
      NameVO.create(record.name),
      ExternalIdVO.from(record.externalId),
      record.createdAt,
      record.updatedAt,
    );
    typeAttendance.remove();
    await this.repository.remove(dto.externalId.value);
  }
}
