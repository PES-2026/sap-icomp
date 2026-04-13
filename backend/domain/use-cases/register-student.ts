import { Student } from "../entities/student.js";
import { type IStudentRepository } from "./interfaces/IStudentRepository.js";

type RegisterStudentInput = {
  name: string;
  cpf: string;
  dtBirth: string; // Converte pra Date dentro do domínio em vez de converter no controller
  email: string;
};

export class StudentRoleNotFoundError extends Error {
  constructor() {
    super("Papel STUDENT não existe ou não foi encontrado");
  }
}

export class CpfAlreadyExistsError extends Error {
  constructor() {
    super("Este CPF já está cadastrado no sistema");
  }
}

export class RegisterStudent {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(data: RegisterStudentInput): Promise<Student> {
    const student = Student.create(
      data.name,
      data.cpf,
      data.dtBirth,
      data.email,
    );

    // Usecase mostra ALUNO e o schema mostra STUDENT...
    const studentRoleId =
      await this.studentRepository.findRoleIdByName("STUDENT");
    if (!studentRoleId) {
      throw new StudentRoleNotFoundError();
    }

    // Chamando a validação
    const cpfAlreadyExists = await this.studentRepository.existsByCpf(
      student.cpf.value,
    );
    if (cpfAlreadyExists) {
      throw new CpfAlreadyExistsError();
    }

    return this.studentRepository.save({
      student,
      idRole: studentRoleId,
      removed: false,
    });
  }
}
