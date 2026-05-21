import { RemoveStudentDTO } from "@application/dtos/student/removeStudentDto";
import { StudentNotFoundError } from "@application/errors/student/studentNotFoundError";
import type { IStudentRepository } from "@domain/repositories/studentRepository";
import { Result } from "@domain/shared/result";

export class RemoveStudent {
  private readonly studentRepository: IStudentRepository;

  constructor(studentRepository: IStudentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute(input: RemoveStudentDTO): Promise<Result<boolean, StudentNotFoundError>> {
    const exists = await this.studentRepository.existsByUUID(input.id);

    if (!exists) {
      return Result.fail<boolean>(new StudentNotFoundError(input.id));
    }

    const result: boolean = await this.studentRepository.disableByUUID(input.id);

    return Result.ok<boolean>(result);
  }
}
