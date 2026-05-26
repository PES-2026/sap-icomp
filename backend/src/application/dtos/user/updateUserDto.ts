import { validateStringField, validateOptionalStringField } from "@domain/utils/validationUtils";

export class UpdateUserDTO {
  constructor(
    public readonly id: string,
    public readonly role: string,
    public readonly name?: string,
    public readonly email?: string,
    public readonly phoneNumber?: string,
    public readonly registrationNumber?: string,
  ) {}

  static create(id: unknown, body: unknown): UpdateUserDTO {
    if (typeof id === "object") {
      throw new Error("id must be sent via parameter and sensitive information via body");
    }

    if (typeof id !== "string" || !body || typeof body !== "object") {
      throw new Error(`Invalid input to ${UpdateUserDTO.name}`);
    }

    const raw = body as Record<string, unknown>;
    const role = validateStringField(raw.role, "role");
    const name = validateOptionalStringField(raw.name, "name");
    const email = validateOptionalStringField(raw.email, "email");
    const phoneNumber = validateOptionalStringField(raw.phoneNumber, "phoneNumber");
    const registrationNumber = validateOptionalStringField(raw.registrationNumber, "registrationNumber");

    return new UpdateUserDTO(id, role, name, email, phoneNumber, registrationNumber);
  }
}
