export class RemoveUserDTO {
  constructor(
    public readonly id: string,
  ) {}

  static create(id: unknown): RemoveUserDTO {
    if (typeof id === "object") {
      throw new Error("id must be sent via parameter");
    }

    if (typeof id !== "string") {
      throw new Error("id is required and must be a string");
    }

    return new RemoveUserDTO(id);
  }
}
