import { randomUUID } from "node:crypto";

export class ExternalIdVO {
  private readonly _value: string;

  private constructor(externalId: string) {
    this._value = externalId;
  }

  static create(): ExternalIdVO {
    const externalId: string = randomUUID();
    return new ExternalIdVO(externalId);
  }

  get value(): string {
    return this._value;
  }

  static from(value: string): ExternalIdVO {
    let isValiUuid: boolean = ExternalIdVO.isValid(value);
    if (!isValiUuid) {
      throw new Error(`Invalid ExternalId format for: ${value}`);
    }
    return new ExternalIdVO(value);
  }

  static isValid(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    let result: boolean = uuidRegex.test(value);
    return result;
  }
}
