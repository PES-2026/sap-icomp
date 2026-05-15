import { Result } from "@domain/shared/result";
import { ExternalIdVO } from "@domain/valueObjects/shared/externalId";
import { NameVO } from "@domain/valueObjects/shared/name";

export type AttendanceTypeProps = {
  id?: string;
  name: string;
};

export type AttendanceTypeVOProps = {
  name: NameVO;
};

export class AttendanceType {
  constructor(
    public readonly externalId: ExternalIdVO,
    public name: NameVO,
  ) {}

  static create(props: AttendanceTypeProps): Result<AttendanceType> {
    const id = ExternalIdVO.create();
    const name = NameVO.create(props.name);

    if (name.isFailure) {
      return Result.fail<AttendanceType>(name.error!);
    }

    return Result.ok<AttendanceType>(new AttendanceType(id.getValue(), name.getValue()));
  }

  static rehydrate(props: AttendanceTypeProps): AttendanceType {
    return new AttendanceType(ExternalIdVO.fromTrusted(props.id!), NameVO.fromTrusted(props.name));
  }

  update(props: Partial<AttendanceTypeVOProps>): void {
    if (props.name !== undefined) this.name = props.name;
  }
}
