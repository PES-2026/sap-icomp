import { validateStringField, validateBooleanField } from "@domain/utils/validationUtils";

export interface ApproveUserRequest {
  id: string;
  isApproved: boolean;
  role?: string;
}

export class ApproveUserDTO {
  constructor(
    public id: string,
    public isApproved: boolean,
    public role?: string,
  ) {}

  static create(data: unknown): ApproveUserDTO {
    if (typeof data !== "object" || data === null) {
      throw new Error(`Invalid input to ${ApproveUserDTO.name}`);
    }

    const raw = data as Record<string, unknown>;

    const id = validateStringField(raw.id, "id");
    const isApproved = validateBooleanField(raw.isApproved, "isApproved");
    const role = raw.role ? validateStringField(raw.role, "role") : undefined;

    return new ApproveUserDTO(id, isApproved, role);
  }
}
