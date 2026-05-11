import {
  validateStringField,
  validateOptionalStringField,
  validateExternalId,
} from "../../../domain/utils/validation.utils";
export interface UpdateCourseResponse {
  externalId: string;
  name: string;
  acronym: string;
  coordinatorId?: string | undefined;
}
export class UpdateCourseDTO {
  constructor(
    readonly externalId: string,
    readonly name: string,
    readonly acronym: string,
    readonly coordenatorId?: string,
  ) {}

  static create(id: unknown, value: unknown): UpdateCourseDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${UpdateCourseDTO.name}`);
    }
    const raw = value as Record<string, unknown>;

    const externalId = validateExternalId(id, "externalId");
    const name = validateStringField(raw.name, "name");
    const acronym = validateStringField(raw.acronym, "acronym");
    const coordenatorId = validateOptionalStringField(raw.coordenatorId, "coordenatorId");

    return new UpdateCourseDTO(externalId, name, acronym, coordenatorId);
  }
}

import {
  validateStringField,
  validateOptionalStringField,
  validateExternalId,
} from "../../../domain/utils/validation.utils";
export interface UpdateCourseResponse {
  externalId: string;
  name: string;
  acronym: string;
  coordinatorId?: string | undefined;
}
export class UpdateCourseDTO {
  constructor(
    readonly externalId: string,
    readonly name: string,
    readonly acronym: string,
    readonly coordenatorId?: string,
  ) {}

  static create(id: unknown, value: unknown): UpdateCourseDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${UpdateCourseDTO.name}`);
    }
    const raw = value as Record<string, unknown>;

    const externalId = validateExternalId(id, "externalId");
    const name = validateStringField(raw.name, "name");
    const acronym = validateStringField(raw.acronym, "acronym");
    const coordenatorId = validateOptionalStringField(raw.coordenatorId, "coordenatorId");

    return new UpdateCourseDTO(externalId, name, acronym, coordenatorId);
  }
}
