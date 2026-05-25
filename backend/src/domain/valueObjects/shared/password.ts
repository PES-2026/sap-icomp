import { PasswordTooLongError } from "@domain/errors/password/passwordTooLong";
import { PasswordTooShortError } from "@domain/errors/password/passwordTooShort";
import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { Result } from "@domain/shared/result";

export type PasswordErrors = RequiredFieldError | PasswordTooShortError | PasswordTooLongError;

export class PasswordVO {
  private readonly _value: string;
  private constructor(password: string) {
    this._value = password;
  }

  static create(plain: string, hashed: string): Result<PasswordVO, PasswordErrors> {
    const validationResult = PasswordVO.validate(plain);
    if (validationResult.isFailure) {
      return Result.fail<PasswordVO>(validationResult.error!);
    }
    return Result.ok<PasswordVO>(new PasswordVO(hashed));
  }

  private static validate(password: string): Result<void> {
    if (!password || password.trim().length === 0) {
      return Result.fail(new RequiredFieldError("password"));
    }
    const pwLength = password.length;
    if (password.length < 8) {
      return Result.fail(new PasswordTooShortError(pwLength));
    }
    if (password.length > 128) {
      return Result.fail(new PasswordTooLongError(pwLength));
    }
    //maybe need to add more validation rules for password, like requiring a mix of uppercase, lowercase, numbers and special characters. But for now, we will keep it simple.
    return Result.ok();
  }

  get value(): string {
    return this._value;
  }

  static fromTrusted(password: string): PasswordVO {
    return new PasswordVO(password);
  }
}
