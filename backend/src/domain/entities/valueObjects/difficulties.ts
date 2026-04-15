<<<<<<< HEAD
export class Difficulties {
  private readonly difficulties: string;

  private constructor(difficulties: string) {
    this.difficulties = difficulties;
    Object.freeze(this);
  }

  static create(difficulties: string): Difficulties {
    return new Difficulties(difficulties);
  }

  get value(): string {
    return this.difficulties;
  }
}
=======
export class Difficulties {
  private readonly difficulties: string;

  private constructor(difficulties: string) {
    this.difficulties = difficulties;
    Object.freeze(this);
  }

  static create(difficulties: string): Difficulties {
    return new Difficulties(difficulties);
  }

  get value(): string {
    return this.difficulties;
  }
}
>>>>>>> c605909 (refactor: reorganize folders to backend/src)
