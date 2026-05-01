export class GeneralObservationsVO {
  private readonly _value: string;

  private constructor(generalObservations: string) {
    this._value = generalObservations;
  }

  static create(generalObservations: string): GeneralObservationsVO {
    GeneralObservationsVO.isValid(generalObservations);
    return new GeneralObservationsVO(generalObservations);
  }

  private static isValid(value: string) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(
        `Invalid general observations: must be a non-empty string. The input value was: ${value}`,
      );
    }
  }

  get value(): string {
    return this._value;
  }
}
