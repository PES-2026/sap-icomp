import { ScheduleSlotPreviewStatus } from "@domain/enum/scheduleSlotStatus";
import { Result } from "@domain/shared/result";

import { EnumVO, InvalidEnumError } from "../shared/enum";

export class ScheduleSlotPreviewStatusVO extends EnumVO<ScheduleSlotPreviewStatus> {
  private constructor(value: ScheduleSlotPreviewStatus) {
    super(value);
  }

  static create(value: string): Result<ScheduleSlotPreviewStatusVO, InvalidEnumError> {
    const validationResult = this.validate(value, ScheduleSlotPreviewStatus, "ScheduleSlotPreviewStatus");

    if (validationResult.isFailure) {
      return Result.fail(validationResult.error!);
    }

    return Result.ok(new ScheduleSlotPreviewStatusVO(value as ScheduleSlotPreviewStatus));
  }

  static fromTrusted(value: string): ScheduleSlotPreviewStatusVO {
    return new ScheduleSlotPreviewStatusVO(value as ScheduleSlotPreviewStatus);
  }
}
