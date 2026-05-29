import { validateOptionalStringField } from "@domain/utils/validationUtils";

export interface UpdateUserResponse {
  name: string;
  email: string;
  phoneNumber: string;
  registrationNumber: string;
}

export class UpdateUserDTO {
  constructor(
    public readonly id: string,
    public readonly role?: string,
    public readonly name?: string,
    public readonly email?: string,
    public readonly phoneNumber?: string,
    public readonly registrationNumber?: string,
  ) {}

  static create(id: unknown, body: unknown): UpdateUserDTO {
    if (typeof id !== "string" || id.trim().length === 0) {
      throw new Error("User Id is required and must be a string");
    }

    if (typeof body !== "object" || body === null) {
      throw new Error(`Invalid input to ${UpdateUserDTO.name}`);
    }

    const raw = body as Record<string, unknown>;
    const role = validateOptionalStringField(raw.role, "role");
    const name = validateOptionalStringField(raw.name, "name");
    const email = validateOptionalStringField(raw.email, "email");
    const phoneNumber = validateOptionalStringField(raw.phoneNumber, "phoneNumber");
    const registrationNumber = validateOptionalStringField(raw.registrationNumber, "registrationNumber");

    return new UpdateUserDTO(id, role, name, email, phoneNumber, registrationNumber);
  }
}
