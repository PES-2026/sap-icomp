import { AttendanceType } from "@domain/enums/attendance/attendanceTypeEnum";
import { InvalidAttendanceDataError } from "@domain/errors/attendance/invalidAttendanceData";
import { Result } from "@domain/shared/result";
import { findValueInEnum } from "@domain/utils/enumUtils";

export class AttendanceTypeVO {
  private readonly _value: AttendanceType;

  private constructor(attendanceId: AttendanceType) {
    this._value = attendanceId;
  }

  static create(value: string): Result<AttendanceTypeVO, InvalidAttendanceDataError> {
    const validationResult = AttendanceTypeVO.validate(value);
    if (validationResult.isFailure) {
      return Result.fail<AttendanceTypeVO>(validationResult.error!);
    }
    const found = findValueInEnum(AttendanceType, value);
    return Result.ok<AttendanceTypeVO>(new AttendanceTypeVO(found!));
  }

  static fromTrusted(value: AttendanceType): AttendanceTypeVO {
    return new AttendanceTypeVO(value);
  }

  private static validate(value: string): Result<void, InvalidAttendanceDataError> {
    const found = findValueInEnum(AttendanceType, value);
    if (found === undefined || found === null) {
      return Result.fail<void>(
        new InvalidAttendanceDataError(
          `Invalid attendance type: must be a value according to the enum: ${Object.keys(AttendanceType).join(", ")}`,
        ),
      );
    }
    return Result.ok<void>();
  }

  get value(): AttendanceType {
    return this._value;
  }
}
