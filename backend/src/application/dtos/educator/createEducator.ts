import { validateComparativeField, validateStringField } from "../../../domain/utils/validationUtils";

export class CreateEducatorDTO {
  constructor(
    public name: string,
    public email: string,
    public emailConfirmation: string,
    public phoneNumber: string,
    public registrationNumber: string,
    public password: string,
    public passwordConfirmation: string,
  ) {}

  static create(data: unknown): CreateEducatorDTO {
    if (typeof data !== "object" || data === null) {
      throw new Error(`Invalid input to ${CreateEducatorDTO.name}`);
    }

    const raw = data as Record<string, unknown>;

    const name = validateStringField(raw.name, "name");
    const email = validateStringField(raw.email, "email");
    const emailConfirmation = validateStringField(raw.emailConfirmation, "emailConfirmation");
    const phoneNumber = validateStringField(raw.phoneNumber, "phoneNumber");
    const registrationNumber = validateStringField(raw.registrationNumber, "registrationNumber");
    const password = validateStringField(raw.password, "password");
    const passwordConfirmation = validateStringField(raw.passwordConfirmation, "passwordConfirmation");

    validateComparativeField(email, emailConfirmation, "emailConfirmation");
    validateComparativeField(password, passwordConfirmation, "passwordConfirmation");

    return new CreateEducatorDTO(
      name,
      email,
      emailConfirmation,
      phoneNumber,
      registrationNumber,
      password,
      passwordConfirmation,
    );
  }
}
