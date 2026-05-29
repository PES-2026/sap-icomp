import { validateStringField, validateComparativeField } from "@domain/utils/validationUtils";

export class UpdateUserPasswordDTO {
  constructor(
    public readonly id: string,
    public readonly role: string,
    public readonly oldPassword: string,
    public readonly newPassword: string,
    public readonly newPasswordConfirmation: string,
  ) {}

  static create(id: unknown, body: unknown): UpdateUserPasswordDTO {
    if (typeof id !== "string" || id.trim().length === 0) {
      throw new Error("User Id is required and must be a string");
    }

    if (typeof body !== "object" || body === null) {
      throw new Error(`Invalid input to ${UpdateUserPasswordDTO.name}`);
    }

    const raw = body as Record<string, unknown>;
    const role = validateStringField(raw.role, "role");
    const oldPassword = validateStringField(raw.oldPassword, "oldPassword");
    const newPassword = validateStringField(raw.newPassword, "newPassword");
    const newPasswordConfirmation = validateStringField(raw.newPasswordConfirmation, "newPasswordConfirmation");

    validateComparativeField(newPassword, newPasswordConfirmation, "newPasswordConfirmation");

    return new UpdateUserPasswordDTO(id, role, oldPassword, newPassword, newPasswordConfirmation);
  }
}
