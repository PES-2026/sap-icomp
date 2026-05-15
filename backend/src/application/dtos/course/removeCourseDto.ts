import { validateExternalIdField } from "@domain/utils/validationUtils";

export class RemoveCourseDTO {
  constructor(public readonly id: string) {}

  static create(id: unknown): RemoveCourseDTO {
    const externalId = validateExternalIdField(id, "id");
    return new RemoveCourseDTO(externalId);
  }
}
