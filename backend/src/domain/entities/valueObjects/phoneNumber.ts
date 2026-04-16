export class PhoneNumber {
  private readonly phoneNumber: string;

  private constructor(phoneNumber: string) {
    this.phoneNumber = phoneNumber;
    Object.freeze(this);
  }

  static create(phoneNumber: string): PhoneNumber {
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      throw new Error("É necessário número de telefone para o cadastro.");
    }

    //retira qualquer caracter não numérico
    const onlyNumber = phoneNumber.replace(/\D/g, "");

    if (!this.validatePhoneNumber(onlyNumber)) {
      throw new Error(
        "Número de telefone inválido, insira o DDD e os noves dígitos",
      );
    }
    return new PhoneNumber(onlyNumber);
  }

  static validatePhoneNumber(phoneNumber: string): boolean {
    const regex = /^([1-9]{2})9[1-9]\d{7}$/; // DDD + 9 dígitos
    return regex.test(phoneNumber);
  }

  get value(): string {
    return this.phoneNumber;
  }
}
