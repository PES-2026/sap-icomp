export class ForeginKey {
  constructor(private readonly value: number) {}

  static create(value: number, optinal: boolean): ForeginKey | undefined {
    if (!value && optinal) {
      return undefined;
    }
    if (!value && !optinal) {
      throw new Error("The entite's foregin key is required for registration.");
    }
  }
}
