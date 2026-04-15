<<<<<<< HEAD
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
}
=======
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
}
>>>>>>> c605909 (refactor: reorganize folders to backend/src)
