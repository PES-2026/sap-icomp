import { StudentNotFoundError } from "@application/errors/student/studentNotFoundError";
import type { IStudentRepository } from "@domain/repositories/studentRepository";
import { Result } from "@domain/shared/result";

export class RemoveStudent {
  private readonly studentRepository: IStudentRepository;

  constructor(studentRepository: IStudentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute(externalId: string): Promise<Result<boolean, StudentNotFoundError>> {
    const exists = await this.studentRepository.existsByUUID(externalId);

    if (!exists) {
      return Result.fail<boolean>(new StudentNotFoundError(externalId));
    }

    const result: boolean = await this.studentRepository.disableByUUID(externalId);

    return Result.ok<boolean>(result);
  }
}
