import { Student } from "@domain/entities/student.js";
import type { IStudentRepository } from "@domain/repositories/studentRepository.js";

export class UpdateStudent {
  private readonly studentRepository: IStudentRepository;

  constructor(studentRepository: IStudentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute(student: StudentData): Promise<Student> {
    const exists = await this.studentRepository.existsByUUID(student.externalId);

    if (!exists) {
      throw new Error("Student not found");
    }

    const updatedStudent = Student.update(student);

    await this.studentRepository.save({ student: updatedStudent });

    return updatedStudent;
  }
}
