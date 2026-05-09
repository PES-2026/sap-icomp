import { AttendanceType } from "../../enums/attendance/attendanceTypeEnum";
import { findValueInEnum } from "../../utils/enumUtils";

export class AttendanceTypeVO {
  private readonly _value: AttendanceType;

  private constructor(attendanceId: AttendanceType) {
    this._value = attendanceId;
  }

  static create(value: string): AttendanceTypeVO {
    const found = findValueInEnum(AttendanceType, value);
    return new AttendanceTypeVO(found);
  }

  get value(): AttendanceType {
    return this._value;
  }
}
