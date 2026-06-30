import { AvailabilityPreviewStatus } from "@domain/enum/availabilityStatus";
import { Result } from "@domain/shared/result";

import { EnumVO, InvalidEnumError } from "../shared/enum";

export class AvailabilityPreviewStatusVO extends EnumVO<AvailabilityPreviewStatus> {
  private constructor(value: AvailabilityPreviewStatus) {
    super(value);
  }

  static create(value: string): Result<AvailabilityPreviewStatusVO, InvalidEnumError> {
    const validationResult = this.validate(value, AvailabilityPreviewStatus, "AvailabilityPreviewStatus");

    if (validationResult.isFailure) {
      return Result.fail(validationResult.error!);
    }

    return Result.ok(new AvailabilityPreviewStatusVO(value as AvailabilityPreviewStatus));
  }

  static fromTrusted(value: string): AvailabilityPreviewStatusVO {
    return new AvailabilityPreviewStatusVO(value as AvailabilityPreviewStatus);
  }
}
