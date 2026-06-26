import { validateArrayField, validateExternalIdField } from "@domain/utils/validationUtils";

export class RemoveManyAvailabilitiesDTO {
  constructor(public readonly ids: string[]) {}

  static create(value: unknown): RemoveManyAvailabilitiesDTO {
    const idsRaw = validateArrayField(value, "ids");

    const ids = idsRaw.map((id, index) => validateExternalIdField(id, `ids[${index}]`));

    return new RemoveManyAvailabilitiesDTO(ids);
  }
}
