import { StudentByIdDTO } from "@application/dtos/student/studentByIdDto";
import { ApplicationError } from "@application/errors/applicationError";
import { StudentNotFoundError } from "@application/errors/student/studentNotFoundError";
import { StudentResult } from "@domain/repositories/results/studentResult";
import type { IStudentRepository } from "@domain/repositories/studentRepository";
import { Result } from "@domain/shared/result";

export class StudentById {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(input: StudentByIdDTO): Promise<Result<StudentResult, ApplicationError>> {
    const student = await this.studentRepository.findByUUID(input.id);

    if (!student) {
      return Result.fail<StudentResult>(new StudentNotFoundError(input.id));
    }

    return Result.ok<StudentResult>(student);
  }
}
