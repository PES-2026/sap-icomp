export class CourseName {
  private name: string;

  private constructor(name: string) {
    this.name = name;
    Object.freeze(this);
  }

  static create(name: string): CourseName {
    if (!name) {
      throw new Error("The course name is required for registration.");
    }
    const trimmed = name.trim();
    if (trimmed.length < 5) {
      //discução: poder ser outra regra de validação
      throw new Error("The name must be longer than five characters.");
    } else if (trimmed.length > 140) {
      throw new Error("Name too long, over 140 characters.");
    }
    return new CourseName(trimmed);
  }
  get value(): string {
    return this.name;
  }
}
