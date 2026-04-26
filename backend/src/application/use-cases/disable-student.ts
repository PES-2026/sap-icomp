import type { IStudentRepository } from "./interfaces/IStudentRepository.js";

export class DisableStudent {
  private readonly studentRepository: IStudentRepository;

  constructor(studentRepository: IStudentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute(externalId: string): Promise<Boolean> {
    const exists = await this.studentRepository.existsByUUID(externalId);

    if (!exists) {
      throw new Error("Student not found");
    }

    return await this.studentRepository.disableByUUID(externalId);
  }
}
