export class RemoveUserDTO {
  constructor(public readonly id: string) {}

  static create(id: unknown): RemoveUserDTO {
    if (typeof id !== "string" || id.trim().length === 0) {
      throw new Error("User Id is required and must be a string");
    }

    return new RemoveUserDTO(id);
  }
}
