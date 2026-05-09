import type { iStudentRepository } from "@domain/repositories/studentRepository";

export class DisableStudent {
  private readonly studentRepository: iStudentRepository;

  constructor(studentRepository: iStudentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute(externalId: string): Promise<boolean> {
    const exists = await this.studentRepository.existsByUUID(externalId);

    if (!exists) {
      throw new Error("Student not found");
    }

    return await this.studentRepository.disableByUUID(externalId);
  }
}
