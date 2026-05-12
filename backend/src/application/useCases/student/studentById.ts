import { StudentByIdDTO } from "@application/dtos/student/studentByIdDto";
import { ApplicationError } from "@application/errors/applicationError";
import { StudentNotFoundError } from "@application/errors/student/studentNotFoundError";
import { Student } from "@domain/entities/student";
import type { IStudentRepository } from "@domain/repositories/studentRepository";
import { Result } from "@domain/shared/result";

export class StudentById {
  private readonly studentRepository: IStudentRepository;

  constructor(studentRepository: IStudentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute(input: StudentByIdDTO): Promise<Result<Student, ApplicationError>> {
    const student = await this.studentRepository.findByUUID(input.id);

    if (!student) {
      return Result.fail<Student>(new StudentNotFoundError(input.id));
    }

    return Result.ok<Student>(student);
  }
}
