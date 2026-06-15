import { validateOptionalStringField, validateTokenField } from "@domain/utils/validationUtils";

export class CancelScheduleByTokenDTO {
  constructor(
    public readonly token: string,
    public readonly reason?: string,
  ) {}

  static create(token: string, body: unknown): CancelScheduleByTokenDTO {
    const validatedToken = validateTokenField(token, "token");

    if (typeof body !== "object" || body === null) {
      return new CancelScheduleByTokenDTO(validatedToken);
    }

    const raw = body as Record<string, unknown>;
    const reason = validateOptionalStringField(raw.reason, "reason");

    return new CancelScheduleByTokenDTO(validatedToken, reason);
  }
}
