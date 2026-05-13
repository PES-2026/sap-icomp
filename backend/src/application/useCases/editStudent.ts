import { Student } from "@domain/entities/student.js";
import type { StudentData } from "@domain/entities/studentData.js";
import type { iStudentRepository } from "@domain/repositories/studentRepository.js";

export class EditStudent {
  private readonly studentRepository: iStudentRepository;

  constructor(studentRepository: iStudentRepository) {
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
