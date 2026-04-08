import { PrismaClient } from "@prisma/client";
import { Student } from "../../core/entities/student";
import { IStudentRepository } from "../../core/use-cases/interfaces/IStudentRepository";

export class PostgresStudentRepository implements IStudentRepository {
  private prisma = new PrismaClient();

  async save(student: Student) {
    await this.prisma.student.create({
      data: {
        name: student.name,
        enrollmentId: student.enrollmentId,
      },
    });
  }
}
