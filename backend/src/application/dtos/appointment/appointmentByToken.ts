import { validateStringField } from "@domain/utils/validationUtils";

export class AppointmentByTokenDTO {
  constructor(public readonly token: string) {}

  static create(token: unknown): AppointmentByTokenDTO {
    if (typeof token !== "string" || !token.trim()) {
      throw new Error("Token is required and must be a string");
    }

    const tokenValue: string = validateStringField(token, "token");

    return new AppointmentByTokenDTO(tokenValue);
  }
}
