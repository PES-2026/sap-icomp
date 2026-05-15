import { validateExternalIdField } from "@domain/utils/validationUtils";

export class CourseByIdDTO {
  constructor(public readonly id: string) {}

  static create(id: unknown): CourseByIdDTO {
    const externalId = validateExternalIdField(id, "id");
    return new CourseByIdDTO(externalId);
  }
}
