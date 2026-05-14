import { validateStringField } from "@domain/utils/validationUtils";

export interface UpdateDiagnosisResponse {
  id: string;
  name: string;
  acronym?: string;
  cid?: string;
}

export class UpdateDiagnosisDTO {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly acronym?: string,
    public readonly cid?: string,
  ) {}

  static create(id: unknown, body: unknown): UpdateDiagnosisDTO {
    if (typeof id !== "string" || !id.trim()) {
      throw new Error("Diagnosis Id is required and must be a string");
    }

    if (typeof body !== "object" || body === null) {
      throw new Error(`Invalid input to ${UpdateDiagnosisDTO.name}`);
    }

    const raw = body as Record<string, unknown>;

    const name = raw.name ? validateStringField(raw.name, "name") : undefined;
    const acronym = raw.acronym ? validateStringField(raw.acronym, "acronym") : undefined;
    const cid = raw.cid ? validateStringField(raw.cid, "cid") : undefined;

    return new UpdateDiagnosisDTO(id.trim(), name, acronym, cid);
  }
}
