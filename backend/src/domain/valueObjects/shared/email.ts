import { Result } from "../../shared/result";
import { EmailTooLongError } from "@domain/errors/email/emailTooLongError";
import { InvalidEmailFormatError } from "@domain/errors/email/invalidEmailFormatError";
import { EmailAccountTooLongError } from "@domain/errors/email/emailAccountTooLongError";
import { EmailDomainPartTooLongError } from "@domain/errors/email/emailDomainPartTooLongError";
import { RequiredFieldError } from "@domain/errors/requiredFieldError";

type EmailErrors =
  | RequiredFieldError
  | EmailTooLongError
  | InvalidEmailFormatError
  | EmailAccountTooLongError
  | EmailDomainPartTooLongError;

export class EmailVO {
  private readonly _value: string;

  private constructor(email: string) {
    this._value = email;
  }

  static create(email: string): Result<EmailVO, EmailErrors> {
    const validationResult = EmailVO.validate(email);
    if (validationResult.isFailure) {
      return Result.fail<EmailVO>(validationResult.error!);
    }
    return Result.ok<EmailVO>(new EmailVO(email.trim()));
  }

  static fromTrusted(email: string): EmailVO {
    return new EmailVO(email);
  }

  get value(): string {
    return this._value;
  }

  private static validate(email: string): Result<void> {
    if (!email || email.trim().length === 0) {
      return Result.fail<void>(new RequiredFieldError("email"));
    }

    const trimmedEmail = email.trim();

    if (trimmedEmail.length > 256) {
      return Result.fail<void>(new EmailTooLongError(trimmedEmail.length));
    }

    const regex =
      /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    if (!regex.test(trimmedEmail)) {
      return Result.fail<void>(new InvalidEmailFormatError(trimmedEmail));
    }

    const parts = trimmedEmail.split("@");
    if (parts.length !== 2) {
      return Result.fail<void>(new InvalidEmailFormatError(trimmedEmail));
    }

    const [account, address] = parts;

    if (account!.length > 64) {
      return Result.fail<void>(new EmailAccountTooLongError(account!.length));
    }

    const domainParts = address!.split(".");
    for (const part of domainParts) {
      if (part.length > 63) {
        return Result.fail<void>(new EmailDomainPartTooLongError(part));
      }
    }

    return Result.ok<void>();
  }
}
