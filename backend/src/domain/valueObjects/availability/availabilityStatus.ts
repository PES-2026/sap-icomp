import { AvailabilityStatusEnum } from "@domain/enum/availabilityStatus";
import { Result } from "@domain/shared/result";

import { EnumVO, InvalidEnumError } from "../shared/enum";

export class AvailabilityStatusVO extends EnumVO<AvailabilityStatusEnum> {
  private constructor(value: AvailabilityStatusEnum) {
    super(value);
  }

  static from(value: string): Result<AvailabilityStatusVO, InvalidEnumError> {
    const validationResult = this.validate(value, AvailabilityStatusEnum, AvailabilityStatusVO.name);

    if (validationResult.isFailure) {
      return Result.fail(validationResult.error!);
    }

    return Result.ok(new AvailabilityStatusVO(validationResult.getValue()));
  }

  static fromTrusted(value: string): AvailabilityStatusVO {
    return new AvailabilityStatusVO(value as AvailabilityStatusEnum);
  }
}
