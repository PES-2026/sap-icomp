export class UserByIdDTO {
  constructor(
    public readonly id: string,
  ) {}

  static create(id: unknown): UserByIdDTO {
    if (typeof id === "object") {
      throw new Error("id must be sent via parameter");
    }

    if (typeof id !== "string") {
      throw new Error("id is required and must be a string");
    }

    return new UserByIdDTO(id);
  }
}
