import { randomUUID } from "node:crypto";
import { Result } from "@domain/shared/result";
import { InvalidExternalIdError } from "@domain/errors/externalId/invalidExternalIdError";

export class ExternalIdVO {
  private readonly _value: string;

  private constructor(externalId: string) {
    this._value = externalId;
  }

  static create(): Result<ExternalIdVO> {
    const externalId: string = randomUUID();
    return Result.ok<ExternalIdVO>(new ExternalIdVO(externalId));
  }

  static fromTrusted(value: string): ExternalIdVO {
    return new ExternalIdVO(value);
  }

  get value(): string {
    return this._value;
  }

  static from(value: string): Result<ExternalIdVO, InvalidExternalIdError> {
    const isValid: boolean = ExternalIdVO.validate(value);

    if (!isValid) {
      return Result.fail<ExternalIdVO>(new InvalidExternalIdError(value));
    }

    return Result.ok<ExternalIdVO>(new ExternalIdVO(value));
  }

  private static validate(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const result: boolean = uuidRegex.test(value);
    return result;
  }
}
