import { ScheduleSlotStatusEnum } from "@domain/enum/scheduleSlotStatus";
import { Result } from "@domain/shared/result";

import { EnumVO, InvalidEnumError } from "../shared/enum";

export class ScheduleSlotStatusVO extends EnumVO<ScheduleSlotStatusEnum> {
  private constructor(value: ScheduleSlotStatusEnum) {
    super(value);
  }

  static from(value: string): Result<ScheduleSlotStatusVO, InvalidEnumError> {
    const validationResult = this.validate(value, ScheduleSlotStatusEnum, ScheduleSlotStatusVO.name);

    if (validationResult.isFailure) {
      return Result.fail(validationResult.error!);
    }

    return Result.ok(new ScheduleSlotStatusVO(validationResult.getValue()));
  }

  static fromTrusted(value: string): ScheduleSlotStatusVO {
    return new ScheduleSlotStatusVO(value as ScheduleSlotStatusEnum);
  }
}
