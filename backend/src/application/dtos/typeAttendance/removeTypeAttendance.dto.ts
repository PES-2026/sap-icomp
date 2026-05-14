import { ExternalIdVO } from "../../../domain/valueObjects/shared/externalId";
export class RemoveTypeAttendanceDTO {
  constructor(public externalId: ExternalIdVO) {}

  static create(value: unknown): RemoveTypeAttendanceDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error("Invalid externalId");
    }

    const raw = value as Record<string, unknown>;

    if (!raw.externalId) {
      throw new Error("externalId is required");
    }
    let externalId: ExternalIdVO;
    if (typeof raw.externalId === "string") {
      externalId = ExternalIdVO.from(raw.externalId);
    } else {
      throw new Error("externalId must be a string");
    }
    return new RemoveTypeAttendanceDTO(externalId);
  }
}
