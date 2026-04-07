export class Student {
  constructor(
    public name: string,
    public enrollmentId: string,
  ) {
    if (!enrollmentId) {
      throw new Error("Enrollment ID is required");
    }
  }
}
