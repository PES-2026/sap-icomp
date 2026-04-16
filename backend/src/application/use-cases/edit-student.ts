import type { IStudentRepository } from "./interfaces/IStudentRepository.js";
import type { StudentData } from "../entities/student-data.js";
import { Student } from "../entities/student.js";

export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("Este e-mail já está cadastrado no sistema");
  }
}

export class EditStudent {
  private readonly studentRepository: IStudentRepository;

  constructor(studentRepository: IStudentRepository) {
    this.studentRepository = studentRepository;
  }

  async editStudent(student: StudentData): Promise<Student> {
    const exists = await this.studentRepository.existsByUUID(
      student.externalId,
    );

    if (!exists) {
      throw new Error("Student not found");
    }

    const updatedStudent = Student.update(student);

    await this.studentRepository.save({ student: updatedStudent });

    return updatedStudent;
  }
}
