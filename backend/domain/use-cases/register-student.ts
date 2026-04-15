import { Student } from "../entities/student";
import { IStudentRepository } from "./interfaces/IStudentRepository";

export class RegisterStudent {
  constructor(private studentRepository: IStudentRepository) {}

  async execute(data: { name: string; id: string }) {
    const student = new Student(data.name, data.id);
    return await this.studentRepository.save(student);
  }
}
