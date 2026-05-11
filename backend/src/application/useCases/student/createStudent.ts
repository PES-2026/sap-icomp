import { Student } from "@domain/entities/student";
import { IStudentRepository } from "@domain/repositories/studentRepository";

// Validação de email e número de matrícula (futuro)
export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("Este e-mail já está cadastrado no sistema");
  }
}

export class EnrollmentAlreadyExistsError extends Error {
  constructor() {
    super("Esta matrícula já está cadastrada no sistema");
  }
}

export class CreateStudent {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(data: RegisterStudentInput): Promise<Student> {
    if (await this.studentRepository.existsByEmail(data.email)) {
      throw new EmailAlreadyExistsError();
    }

    if (await this.studentRepository.existsByEnrollmentId(data.enrollmentId)) {
      throw new EnrollmentAlreadyExistsError();
    }

    const studentOrError = Student.create(
      data.name,
      data.enrollmentId,
      data.dtBirth,
      data.email,
      data.phoneNumber,
      data.courseId,
      data.diagnosis ?? "",
      data.potential ?? "",
      data.difficulties ?? "",
    ) as Student | Error;

    if (studentOrError instanceof Error) {
      throw studentOrError;
    }

    return this.studentRepository.save({ student: studentOrError });
  }
}
