<<<<<<< HEAD
export class Potential {
  private readonly potential: string;

  private constructor(potential: string) {
    this.potential = potential;
    Object.freeze(this);
  }

  static create(potential: string): Potential {
    return new Potential(potential);
  }
  get value(): string {
    return this.potential;
  }
}
=======
export class Potential {
  private readonly potential: string;

  private constructor(potential: string) {
    this.potential = potential;
    Object.freeze(this);
  }

  static create(potential: string): Potential {
    return new Potential(potential);
  }
  get value(): string {
    return this.potential;
  }
}
>>>>>>> c605909 (refactor: reorganize folders to backend/src)
