import { Name } from "../valueObjects/typeAttendance/name";
import { ExternalIdVO } from "../valueObjects/shared/externalId";
import { CreateTypeAttendanceDto } from "../../application/dtos/typeAttendance/createTypeAttendance.dto";
export class TypeAttendance {
  constructor(
    public readonly name: Name,
    public readonly externalId: ExternalIdVO,
  ) {}
  static create(dto: CreateTypeAttendanceDto): TypeAttendance {
    const nameVO = Name.create(dto.name);
    const externalIdVO = ExternalIdVO.create();
    return new TypeAttendance(nameVO, externalIdVO);
  }
}
