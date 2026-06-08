import { validateStringField } from "@domain/utils/validationUtils";

export class ForgotPasswordDTO {
  constructor(public readonly email: string) {}

  static create(body: unknown): ForgotPasswordDTO {
    if (typeof body !== "object" || body === null) {
      throw new Error(`Invalid input to ${ForgotPasswordDTO.name}`);
    }

    const raw = body as Record<string, unknown>;
    const email = validateStringField(raw.email, "email");

    return new ForgotPasswordDTO(email);
  }
}
