import { validateExternalId } from "@domain/utils/validationUtils";

export class CourseByIdDTO {
  constructor(public readonly id: string) {}

  static create(id: unknown): CourseByIdDTO {
    const externalId = validateExternalId(id, "id");
    return new CourseByIdDTO(externalId);
  }
}
