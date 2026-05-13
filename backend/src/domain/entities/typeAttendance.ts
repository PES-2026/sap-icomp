import { Name } from "../valueObjects/typeAttendance/name";
import { ExternalIdVO } from "../valueObjects/shared/externalId";
import { CreateTypeAttendanceDTO } from "../../application/dtos/typeAttendance/createTypeAttendance.dto";
import { UpdateTypeAttendanceDTO } from "../../application/dtos/typeAttendance/updateTypeAttendance.dto";
export class TypeAttendance {
  constructor(
    public readonly name: Name,
    public readonly externalId: ExternalIdVO,
  ) {}
  static create(dto: CreateTypeAttendanceDTO): TypeAttendance {
    const nameVO = Name.create(dto.name);
    const externalIdVO = ExternalIdVO.create();
    return new TypeAttendance(nameVO, externalIdVO);
  }
  static update(dto: UpdateTypeAttendanceDTO): TypeAttendance {
    const nameVO = Name.create(dto.name);
    const externalIdVO = ExternalIdVO.from(dto.externalId);
    return new TypeAttendance(nameVO, externalIdVO);
  }
}
