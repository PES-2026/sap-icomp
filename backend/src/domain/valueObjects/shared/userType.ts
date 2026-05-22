import { Result } from "@domain/shared/result";
import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { UserStatusEnum } from "@domain/enum/userStatus";
import { UserStatusInvalidError } from "@domain/errors/userStatus/UserStatusInvalidError";
import { UserTypeEnum } from "@domain/enum/userType";
import { UserTypeInvalidError } from "@domain/errors/userType/userTypeInvalidError";
export type UserTypeErrors = RequiredFieldError | UserTypeInvalidError;

export class UserTypeVO {
  constructor(private readonly _value: UserTypeEnum) {}

  static create(type: string): Result<UserTypeVO, UserTypeErrors> {
    const trimmedType = type.trim().toUpperCase();

    const validationResult = UserTypeVO.validate(trimmedType);

    if (validationResult.isFailure) {
      return Result.fail(validationResult.error as UserTypeErrors);
    }

    return Result.ok(new UserTypeVO(trimmedType as UserTypeEnum));
  }
  private static validate(type: string): Result<void> {
    if (!type || type.trim().length === 0) {
      return Result.fail(new RequiredFieldError("type"));
    }

    if (!Object.values(UserTypeEnum).includes(type as UserTypeEnum)) {
      return Result.fail(new UserTypeInvalidError(type));
    }
    return Result.ok();
  }

  get value(): UserTypeEnum {
    return this._value;
  }

  static fromTrusted(type: string): UserTypeVO {
    return new UserTypeVO(type as UserTypeEnum);
  }
}
