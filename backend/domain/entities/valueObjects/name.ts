export class Name {
  private name: string;

  private constructor(name: string) {
    this.name = name;
    Object.freeze(this);
  }

  static create(name: string): Name {
    if (!name) {
      throw new Error("Nome do estudante é necessário para o cadastro.");
    }
    const trimmed = name.trim();
    if (trimmed.length < 5) {
      //discução: poder ser outra regra de validação
      throw new Error("Nome precisa ter mais de cinco caracteres.");
    } else if (trimmed.length > 255) {
      throw new Error("Nome muito longo, acima de 255 caracteres.");
    }
    return new Name(trimmed);
  }
  get value(): string {
    return this.name;
  }
}
