import { validateOptionalStringField, validateStringField } from "@domain/utils/validationUtils";

export interface CreateCourseResponse {
  id: string;
  name: string;
  acronym: string;
  coordinatorId?: string;
}

export class CreateCourseDTO {
  constructor(
    public readonly name: string,
    public readonly acronym: string,
    public readonly coordinatorId?: string,
  ) {}

  static create(value: unknown): CreateCourseDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${CreateCourseDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const name = validateStringField(raw.name, "name");
    const acronym = validateStringField(raw.acronym, "acronym");
    const coordinatorId = validateOptionalStringField(raw.coordinatorId, "coordinatorId");

    return new CreateCourseDTO(name, acronym, coordinatorId);
  }
}
