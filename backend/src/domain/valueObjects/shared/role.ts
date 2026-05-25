import { Result } from "@domain/shared/result";
import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { RoleEnum } from "@domain/enum/role";
import { RoleInvalidError } from "@domain/errors/role/roleInvalidError";
import { findValueInEnum } from "@domain/utils/enumUtils";
export type RoleErrors = RequiredFieldError | RoleInvalidError;

export class RoleVO {
  constructor(private readonly _value: RoleEnum) {}

  static create(role: string): Result<RoleVO, RoleErrors> {
    const trimmedRole = role.trim().toUpperCase();

    const validationResult = RoleVO.validate(trimmedRole);

    if (validationResult.isFailure) {
      return Result.fail(validationResult.error as RoleErrors);
    }

    return Result.ok(new RoleVO(trimmedRole as RoleEnum));
  }
  private static validate(role: string): Result<void> {
    if (!role || role.trim().length === 0) {
      return Result.fail(new RequiredFieldError("role"));
    }

    if (!findValueInEnum(RoleEnum, role)) {
      return Result.fail(new RoleInvalidError(role));
    }
    return Result.ok();
  }

  get value(): RoleEnum {
    return this._value;
  }

  static fromTrusted(role: string): RoleVO {
    return new RoleVO(role as RoleEnum);
  }
}
