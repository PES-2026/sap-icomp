export class Enrollment {
  private enrollment: string;

  private constructor(enrollment: string) {
    this.enrollment = enrollment;
    Object.freeze(this);
  }

  static create(enrollment: string): Enrollment {
    if (!enrollment) {
      throw new Error("Matrícula do estudante é necessária para o cadastro");
    }

    if (!this.isNumeric(enrollment)) {
      throw new Error("Matrícula inválida, insira apenas caracteres numéricos");
    } else if (enrollment.length < 8) {
      throw new Error(
        "Matrícula inválida, quantidade de caracteres menor que oito",
      );
    }
    return new Enrollment(enrollment);
  }

  get value(): string {
    return this.enrollment;
  }

  static isNumeric(value: string): boolean {
    return /^[0-9]+$/.test(value);
  }
}
