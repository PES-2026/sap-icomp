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

  async execute(externalId: string): Promise<Result<Student, ApplicationError>> {
    const student = await this.studentRepository.findByUUID(externalId);

    if (!student) {
      return Result.fail<Student>(new StudentNotFoundError(externalId));
    }

    return Result.ok<Student>(student);
  }
}
