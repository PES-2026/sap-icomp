import { validateStringField, validateComparativeField } from "@domain/utils/validationUtils";

export class ResetPasswordDTO {
  constructor(
    public readonly token: string,
    public readonly newPassword: string,
    public readonly newPasswordConfirmation: string,
  ) {}

  static create(body: unknown): ResetPasswordDTO {
    if (typeof body !== "object" || body === null) {
      throw new Error(`Invalid input to ${ResetPasswordDTO.name}`);
    }

    const raw = body as Record<string, unknown>;
    const token = validateStringField(raw.token, "token");
    const newPassword = validateStringField(raw.newPassword, "newPassword");
    const newPasswordConfirmation = validateStringField(raw.newPasswordConfirmation, "newPasswordConfirmation");

    // Defensive mitigation against URL encoding in passwords
    const queryPatterns = /[%&=+]/;
    [newPassword, newPasswordConfirmation].forEach((field, index) => {
      if (queryPatterns.test(field)) {
        const fieldName = ["newPassword", "newPasswordConfirmation"][index];
        throw new Error(`${fieldName} contains invalid characters that suggest an insecure transmission method.`);
      }
    });

    validateComparativeField(newPassword, newPasswordConfirmation, "newPasswordConfirmation");

    return new ResetPasswordDTO(token, newPassword, newPasswordConfirmation);
  }
}
