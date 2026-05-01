export class DemandVO {
  private readonly _value: string;

  private constructor(demand: string) {
    this._value = demand;
  }

  static create(demand: string): DemandVO {
    return new DemandVO(demand);
  }

  get value(): string {
    return this._value;
  }

  static from(value: string): DemandVO {
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(
        `Invalid demand: must be a non-empty string. The input value was: ${value}`,
      );
    }
    return new DemandVO(value);
  }
}
