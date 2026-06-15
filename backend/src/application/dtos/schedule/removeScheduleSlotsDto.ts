import { validateArrayField, validateExternalIdField } from "@domain/utils/validationUtils";

export class RemoveScheduleSlotsDTO {
  constructor(public readonly ids: string[]) {}

  static create(value: unknown): RemoveScheduleSlotsDTO {
    const idsRaw = validateArrayField(value, "ids");

    const ids = idsRaw.map((id, index) => validateExternalIdField(id, `ids[${index}]`));

    return new RemoveScheduleSlotsDTO(ids);
  }
}
