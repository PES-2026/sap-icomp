import {
  validateStringField,
  validateOptionalStringField,
  validateOptionalNumberField,
} from "../../../domain/utils/validation.utils";
class CreateCourseDTO {
  constructor(
    public readonly name: string,
    public readonly acronym: string | undefined,
    public readonly cordinatirId: number | undefined,
  ) {}

  static create(value: unknown): CreateCourseDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${CreateCourseDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const name = validateStringField(raw.name, "name");
    const acronym = validateOptionalStringField(raw.acronym, "acronym");
    const cordinatirId = validateOptionalNumberField(raw.cordinatirId, "cordinatirId");

    return new CreateCourseDTO(name, acronym, cordinatirId);
  }
}
