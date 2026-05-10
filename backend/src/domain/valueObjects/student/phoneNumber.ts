import { Result } from "@domain/shared/result";
import { InvalidPhoneNumberFormatError } from "@domain/errors/phoneNumber/invalidPhoneNumberFormatError";
import { RequiredFieldError } from "@domain/errors/requiredFieldError";

type PhoneNumberErrors = RequiredFieldError | InvalidPhoneNumberFormatError;

export class PhoneNumberVO {
  private readonly _value: string;

  private constructor(phoneNumber: string) {
    this._value = phoneNumber;
  }

  static create(phoneNumber: string): Result<PhoneNumberVO, PhoneNumberErrors> {
    const validationResult = PhoneNumberVO.validate(phoneNumber);
    if (validationResult.isFailure) {
      return Result.fail<PhoneNumberVO>(validationResult.error!);
    }
    const onlyNumber = phoneNumber.replace(/\D/g, "");
    return Result.ok<PhoneNumberVO>(new PhoneNumberVO(onlyNumber));
  }

  static fromTrusted(phoneNumber: string): PhoneNumberVO {
    return new PhoneNumberVO(phoneNumber);
  }

  private static validate(phoneNumber: string): Result<void, PhoneNumberErrors> {
    if (!phoneNumber || phoneNumber.trim() === "") {
      return Result.fail<void>(new RequiredFieldError("phone number"));
    }
    const onlyNumber = phoneNumber.replace(/\D/g, "");
    const regex = /^([1-9]{2})9[1-9]\d{7}$/; // DDD + 9 digits
    if (!regex.test(onlyNumber)) {
      return Result.fail<void>(new InvalidPhoneNumberFormatError(phoneNumber));
    }
    return Result.ok<void>();
  }

  get value(): string {
    return this._value;
  }
}
