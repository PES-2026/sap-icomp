import { Prisma, PrismaClient } from "@prisma/client";
import { Student } from "../../domain/entities/student.js";
import {
  type IStudentRepository,
  type SaveStudentParams,
} from "../../domain/use-cases/interfaces/IStudentRepository.js";
import { CpfAlreadyExistsError } from "../../domain/use-cases/register-student.js";

export class PrismaStudentRepository implements IStudentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findRoleIdByName(roleName: string): Promise<number | null> {
    const role = await this.prisma.userRole.findFirst({
      where: { name: roleName },
      select: { id: true },
    });

    return role?.id ?? null;
  }

  // A validação de unicidade #73 do usecase
  async existsByCpf(cpf: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { cpf },
      select: { id: true },
    });

    return !!user;
  }

  async save(params: SaveStudentParams): Promise<Student> {
    const { student, idRole, removed } = params;

    try {
      await this.prisma.user.create({
        data: {
          name: student.name.value,
          cpf: student.cpf.value,
          birthDate: student.dtBirth.value,
          email: student.email.value,
          idRole,
          removed,
        },
      });

      return student;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new CpfAlreadyExistsError();
      }
      throw error;
    }
  }
}
