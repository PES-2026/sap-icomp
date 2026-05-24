import { IProfessorRepository } from "../../../domain/repositories/professorRepository";
import { Professor } from "../../../domain/entities/professor";
import { PrismaClient } from "@prisma/src/infrastructure/database/generated/client";

export class PrismaProfessorRepository implements IProfessorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(professor: Professor): Promise<void> {
    const externalId = professor.id.value;

    const baseData = {
      externalId,
      registration: professor.registrationNumber.value,
      name: professor.name.value,
      email: professor.email.value,
      phoneNumber: professor.phoneNumber.value,
      userStatus: professor.userStatus.value,
      password: professor.password.value,
    };
    await this.prisma.professor.create({
      data: {
        ...baseData,
      },
    });
  }
  async existsByEmail(email: string): Promise<boolean> {
    const account = await this.prisma.professor.findFirst({
      where: {
        email: email,
      },
    });

    return !!account;
  }
  async existsByRegistrationNumber(registrationNumber: string): Promise<boolean> {
    const account = await this.prisma.professor.findFirst({
      where: {
        registration: registrationNumber,
      },
    });

    return !!account;
  }
}
