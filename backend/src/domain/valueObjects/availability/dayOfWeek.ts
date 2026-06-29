import { DaysOfWeekEnum } from "@domain/enum/daysOfWeek";
import { Result } from "@domain/shared/result";

import { EnumVO, InvalidEnumError } from "../shared/enum";

export class DayOfWeekVO extends EnumVO<DaysOfWeekEnum> {
  private constructor(value: DaysOfWeekEnum) {
    super(value);
  }

  static from(value: string): Result<DayOfWeekVO, InvalidEnumError> {
    const validationResult = this.validate(value, DaysOfWeekEnum, DayOfWeekVO.name);

    if (validationResult.isFailure) {
      return Result.fail(validationResult.error!);
    }

    return Result.ok(new DayOfWeekVO(validationResult.getValue()));
  }

  static fromTrusted(value: string): DayOfWeekVO {
    return new DayOfWeekVO(value as DaysOfWeekEnum);
  }
}
