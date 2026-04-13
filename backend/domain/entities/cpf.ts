export class Cpf {
  private constructor(private readonly cpf: string) {}

  static create(cpf: string): Cpf {
    const digits = cpf.replace(/\D/g, "");
    if (digits.length !== 11) {
      throw new Error("O CPF deve conter 11 dígitos");
    }
    return new Cpf(digits);
  }

  get value(): string {
    return this.cpf;
  }
}
