export class Name {
  private name: string;

  private constructor(name: string) {
    this.name = name;
    Object.freeze(this);
  }

  static create(name: string): Name {
    if (!name) {
      throw new Error("TypeAttendance name is required.");
    }
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      //discução: poder ser outra regra de validação
      throw new Error(
        "TypeAttendance name must have more than two characters.",
      );
    } else if (trimmed.length > 24) {
      throw new Error(
        "TypeAttendance name is too long, it must have less than 24 characters.",
      );
    }
    return new Name(trimmed);
  }
  get value(): string {
    return this.name;
  }
}
