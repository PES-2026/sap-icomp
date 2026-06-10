import { RoleEnum } from "@domain/enum/role";
import { validateStringField } from "@domain/utils/validationUtils";

export class AuthenticateUserRequestDTO {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}

  static create(value: unknown): AuthenticateUserRequestDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${AuthenticateUserRequestDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const email = validateStringField(raw.email, "email");
    const password = validateStringField(raw.password, "password");

    return new AuthenticateUserRequestDTO(email, password);
  }
}

export interface AuthenticateUserResponseDTO {
  user: {
    id: string;
    name: string;
    email: string;
    role: RoleEnum;
  };
  token: string;
}
