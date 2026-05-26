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

  static create(idOrData: unknown, data?: unknown): UpdateUserDTO {
    let id: string;
    let raw: Record<string, unknown>;

    if (typeof idOrData === "string" && data && typeof data === "object") {
      id = idOrData;
      raw = data as Record<string, unknown>;
    } else if (typeof idOrData === "object" && idOrData !== null) {
      raw = idOrData as Record<string, unknown>;
      id = validateStringField(raw.id, "id");
    } else {
      throw new Error(`Invalid input to ${UpdateUserDTO.name}`);
    }

    const role = validateStringField(raw.role, "role");
    const name = validateOptionalStringField(raw.name, "name");
    const email = validateOptionalStringField(raw.email, "email");
    const phoneNumber = validateOptionalStringField(raw.phoneNumber, "phoneNumber");
    const registrationNumber = validateOptionalStringField(raw.registrationNumber, "registrationNumber");

    return new UpdateUserDTO(id, role, name, email, phoneNumber, registrationNumber);
  }
}
