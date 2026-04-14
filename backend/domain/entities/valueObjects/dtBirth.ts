export class DtBirth {
  private readonly dtBirth: Date;

  private constructor(dtBirth: Date) {
    this.dtBirth = dtBirth;
    Object.freeze(this);
  }
  static create(dtBirth: string): DtBirth {
    const [year, month, day] = dtBirth.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    if (isNaN(date.getTime())) {
      throw new Error("Data inválida");
    }

    return new DtBirth(date);
  }

  get value(): Date {
    return this.dtBirth;
  }
}
