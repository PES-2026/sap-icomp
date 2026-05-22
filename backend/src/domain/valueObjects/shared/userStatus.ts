import { Result } from "@domain/shared/result";
import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { UserStatusEnum } from "@domain/enum/userStatus";
import { UserStatusInvalidError } from "@domain/errors/userStatus/UserStatusInvalidError";
export type UserStatusErrors = RequiredFieldError | UserStatusInvalidError;

export class UserStatusVO {
  constructor(private readonly _value: UserStatusEnum) {}

  static create(status: string): Result<UserStatusVO, UserStatusErrors> {
    const trimmedStatus = status.trim().toUpperCase();

    const validationResult = UserStatusVO.validate(trimmedStatus);

    if (validationResult.isFailure) {
      return Result.fail(validationResult.error as UserStatusErrors);
    }

    return Result.ok(new UserStatusVO(trimmedStatus as UserStatusEnum));
  }
  private static validate(status: string): Result<void> {
    if (!status || status.trim().length === 0) {
      return Result.fail(new RequiredFieldError("status"));
    }

    if (!Object.values(UserStatusEnum).includes(status as UserStatusEnum)) {
      return Result.fail(new UserStatusInvalidError(status));
    }
    return Result.ok();
  }

  get value(): UserStatusEnum {
    return this._value;
  }

  static fromTrusted(status: string): UserStatusVO {
    return new UserStatusVO(status as UserStatusEnum);
  }
}
