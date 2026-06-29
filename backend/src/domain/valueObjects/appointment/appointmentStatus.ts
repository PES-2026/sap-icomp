import { AppointmentStatusEnum } from "@domain/enum/appointmentStatus";
import { Result } from "@domain/shared/result";

import { EnumVO, InvalidEnumError } from "../shared/enum";

export class AppointmentStatusVO extends EnumVO<AppointmentStatusEnum> {
  private constructor(value: AppointmentStatusEnum) {
    super(value);
  }

  static from(value: string): Result<AppointmentStatusVO, InvalidEnumError> {
    const validationResult = this.validate(value, AppointmentStatusEnum, AppointmentStatusVO.name);

    if (validationResult.isFailure) {
      return Result.fail(validationResult.error!);
    }

    return Result.ok(new AppointmentStatusVO(validationResult.getValue()));
  }

  static fromTrusted(value: string): AppointmentStatusVO {
    return new AppointmentStatusVO(value as AppointmentStatusEnum);
  }
}
