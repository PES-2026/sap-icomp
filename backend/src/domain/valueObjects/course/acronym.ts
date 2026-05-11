export class Acronym {
  constructor(private readonly name: string) {}

  static create(value: string): Acronym {
    if (!value) {
      throw new Error("The acronym is required for registration.");
    }
    const trimmed = value.trim();
    if (trimmed.length < 5) {
      throw new Error("The acronym must be longer than one characters.");
    } else if (trimmed.length > 15) {
      throw new Error("Acronym too long, over 15 characters.");
    }
    return new Acronym(trimmed);
  }
  get value(): string {
    return this.name;
  }
}
