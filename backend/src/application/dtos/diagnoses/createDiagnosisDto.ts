import { validateStringField } from "@domain/utils/validationUtils";

export interface CreateDiagnosisResponse {
  id: string;
  name: string;
  acronym: string;
  cid: string;
}

export class CreateDiagnosisDTO {
  constructor(
    public readonly name: string,
    public readonly acronym?: string,
    public readonly cid?: string,
  ) {}

  static create(value: unknown): CreateDiagnosisDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${CreateDiagnosisDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const name = validateStringField(raw.name, "name");
    const acronym = raw.acronym ? validateStringField(raw.acronym, "acronym") : undefined;
    const cid = raw.cid ? validateStringField(raw.cid, "cid") : undefined;

    return new CreateDiagnosisDTO(name, acronym, cid);
  }
}
