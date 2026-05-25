import { Result } from "@domain/shared/result";
import { RequiredFieldError } from "@domain/errors/requiredFieldError";
import { RegistrationTooLongError } from "@domain/errors/registration/registrationTooLongError";
import { RegistrationTooShortError } from "@domain/errors/registration/registrationTooShortError";
import { RegistrationOnlyNumberError } from "@domain/errors/registration/registrationOnlyNumber";
import { RegistrationAlreadyExistError } from "@domain/errors/registration/registrationAlreadyExist";

export type RegistrationNumberErrors =
  | RegistrationTooLongError
  | RequiredFieldError
  | RegistrationOnlyNumberError
  | RegistrationTooShortError
  | RegistrationAlreadyExistError;

export class RegistrationNumberVO {
  private readonly _value: string;
  private constructor(registrationNumber: string) {
    this._value = registrationNumber;
  }

  static create(registrationNumber: string): Result<RegistrationNumberVO, RegistrationNumberErrors> {
    const validationResult = RegistrationNumberVO.validate(registrationNumber);
    if (validationResult.isFailure) {
      return Result.fail<RegistrationNumberVO>(validationResult.error!);
    }
    return Result.ok(new RegistrationNumberVO(registrationNumber));
  }
  private static validate(registrationNumber: string): Result<void> {
    if (!registrationNumber || registrationNumber.trim().length === 0) {
      return Result.fail(new RequiredFieldError("registration number"));
    }
    const trimmedRegistration = registrationNumber.trim();

    if (trimmedRegistration.length < 7) {
      return Result.fail(new RegistrationTooShortError(trimmedRegistration.length));
    }

    //need to check the lenght of registration number with the stackholder.
    if (trimmedRegistration.length > 10) {
      return Result.fail(new RegistrationTooLongError(trimmedRegistration.length));
    }

    if (!/^\d+$/.test(trimmedRegistration)) {
      return Result.fail(new RegistrationOnlyNumberError("registration number"));
    }

    return Result.ok();
  }
  static fromTrusted(registrationNumber: string): RegistrationNumberVO {
    return new RegistrationNumberVO(registrationNumber);
  }
  get value(): string {
    return this._value;
  }
}
