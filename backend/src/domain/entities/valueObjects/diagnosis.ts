<<<<<<< HEAD
export class Diagnosis {
  private readonly diagnosis: string;

  private constructor(diagnosis: string) {
    this.diagnosis = diagnosis;
    Object.freeze(this);
  }

  static create(diagnosis: string): Diagnosis {
    return new Diagnosis(diagnosis);
  }
  get value(): string {
    return this.diagnosis;
  }
}
=======
export class Diagnosis {
  private readonly diagnosis: string;

  private constructor(diagnosis: string) {
    this.diagnosis = diagnosis;
    Object.freeze(this);
  }

  static create(diagnosis: string): Diagnosis {
    return new Diagnosis(diagnosis);
  }
  get value(): string {
    return this.diagnosis;
  }
}
>>>>>>> c605909 (refactor: reorganize folders to backend/src)
