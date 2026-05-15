import { randomUUID } from "node:crypto";
export class ProfessorId {
  private readonly professorId: string;

  private constructor(professorId: string) {
    this.professorId = professorId;
  }

  static create(): ProfessorId {
    const professorId = randomUUID();
    return new ProfessorId(professorId);
  }
  get value(): string {
    return this.professorId;
  }

  static reutilise(professorId: string): ProfessorId {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(professorId)) {
      throw new Error("Invalid UUID");
    }

    return new ProfessorId(professorId);
  }
}
