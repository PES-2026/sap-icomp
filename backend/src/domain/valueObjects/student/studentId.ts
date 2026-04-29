import { randomUUID } from "node:crypto";
export class StudentId {
  private readonly studentId: string;

  private constructor(studentId: string) {
    this.studentId = studentId;
  }

  static create(): StudentId {
    const studentId = randomUUID();
    return new StudentId(studentId);
  }
  get value(): string {
    return this.studentId;
  }

  static reutilise(studentId: string): StudentId {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(studentId)) {
      throw new Error("Invalid UUID");
    }

    return new StudentId(studentId);
  }
}
