export class ActivateUserDTO {
  constructor(public readonly id: string) {}

  static create(id: unknown): ActivateUserDTO {
    if (typeof id !== "string" || id.trim().length === 0) {
      throw new Error("User Id is required and must be a string");
    }

    return new ActivateUserDTO(id);
  }
}
