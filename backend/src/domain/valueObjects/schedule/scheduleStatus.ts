import { ScheduleStatusEnum } from "@domain/enum/scheduleStatus";
import { Result } from "@domain/shared/result";

import { EnumVO, InvalidEnumError } from "../shared/enum";

export class ScheduleStatusVO extends EnumVO<ScheduleStatusEnum> {
  private constructor(value: ScheduleStatusEnum) {
    super(value);
  }

  static from(value: string): Result<ScheduleStatusVO, InvalidEnumError> {
    const validationResult = this.validate(value, ScheduleStatusEnum, ScheduleStatusVO.name);

    if (validationResult.isFailure) {
      return Result.fail(validationResult.error!);
    }

    return Result.ok(new ScheduleStatusVO(validationResult.getValue()));
  }

  static fromTrusted(value: string): ScheduleStatusVO {
    return new ScheduleStatusVO(value as ScheduleStatusEnum);
  }
}
