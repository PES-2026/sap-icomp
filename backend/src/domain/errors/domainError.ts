export abstract class DomainError {
  public readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}
