<<<<<<< HEAD
export class Course {
  private readonly course: string;

  private constructor(course: string) {
    this.course = course;
    Object.freeze(this);
  }

  static create(course: string): Course {
    if (!course || course.trim().length === 0) {
      throw new Error("É necessário selecionar o curso para o cadastro.");
    }

    return new Course(course);
  }
  get value(): string {
    return this.course;
  }
}
=======
export class Course {
  private readonly course: string;

  private constructor(course: string) {
    this.course = course;
    Object.freeze(this);
  }

  static create(course: string): Course {
    if (!course || course.trim().length === 0) {
      throw new Error("É necessário selecionar o curso para o cadastro.");
    }

    return new Course(course);
  }
  get value(): string {
    return this.course;
  }
}
>>>>>>> c605909 (refactor: reorganize folders to backend/src)
