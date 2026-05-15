import { Result } from "@domain/shared/result";
import { ExternalIdVO } from "@domain/valueObjects/shared/externalId";
import { TypeAttendanceNameVO } from "@domain/valueObjects/typeAttendance/typeAttendanceName";

export type TypeAttendanceProps = {
  id?: string;
  name: string;
};

export type TypeAttendanceVOProps = {
  name: TypeAttendanceNameVO;
};

export class TypeAttendance {
  constructor(
    public readonly externalId: ExternalIdVO,
    public name: TypeAttendanceNameVO,
  ) {}

  static create(props: TypeAttendanceProps): Result<TypeAttendance> {
    const id = ExternalIdVO.create();
    const name = TypeAttendanceNameVO.create(props.name);

    if (name.isFailure) {
      return Result.fail<TypeAttendance>(name.error!);
    }

    return Result.ok<TypeAttendance>(new TypeAttendance(id.getValue(), name.getValue()));
  }

  static rehydrate(props: TypeAttendanceProps): TypeAttendance {
    return new TypeAttendance(ExternalIdVO.fromTrusted(props.id!), TypeAttendanceNameVO.fromTrusted(props.name));
  }

  update(props: Partial<TypeAttendanceVOProps>): void {
    if (props.name !== undefined) this.name = props.name;
  }
}
