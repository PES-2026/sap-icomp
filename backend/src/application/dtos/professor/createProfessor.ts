import { validateStringField, validateComparativeField } from "@domain/utils/validationUtils";

export interface CreateProfessorRequest {
  name: string;
  email: string;
  emailConfirmation: string;
  phoneNumber: string;
  registrationNumber: string;
  role?: string;
  password: string;
  passwordConfirmation: string;
}

export interface CreateProfessorResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  registrationNumber: string;
  role?: string | undefined;
  userStatus: string;
}

export class CreateProfessorDTO {
  constructor(
    public name: string,
    public email: string,
    public emailConfirmation: string,
    public phoneNumber: string,
    public registrationNumber: string,
    public password: string,
    public passwordConfirmation: string,
    public role?: string,
  ) {}

  static create(data: unknown): CreateProfessorDTO {
    if (typeof data !== "object" || data === null) {
      throw new Error(`Invalid input to ${CreateProfessorDTO.name}`);
    }

    const raw = data as Record<string, unknown>;

    const name = validateStringField(raw.name, "name");
    const email = validateStringField(raw.email, "email");
    const emailConfirmation = validateStringField(raw.emailConfirmation, "emailConfirmation");
    const phoneNumber = validateStringField(raw.phoneNumber, "phoneNumber");
    const registrationNumber = validateStringField(raw.registrationNumber, "registrationNumber");
    const password = validateStringField(raw.password, "password");
    const passwordConfirmation = validateStringField(raw.passwordConfirmation, "passwordConfirmation");
    const role = raw.role ? validateStringField(raw.role, "role") : undefined;

    validateComparativeField(email, emailConfirmation, "emailConfirmation");
    validateComparativeField(password, passwordConfirmation, "passwordConfirmation");

    return new CreateProfessorDTO(
      name,
      email,
      emailConfirmation,
      phoneNumber,
      registrationNumber,
      password,
      passwordConfirmation,
      role,
    );
  }
}
