import { IPedagogueRepository } from "../../../domain/repositories/pedagogueRepository";
import { Pedagogue } from "../../../domain/entities/pedagogue";
import { PrismaClient, Prisma } from "@prisma/src/infrastructure/database/generated/client";

export class PrismaPedagogueRepository implements IPedagogueRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(pedagogue: Pedagogue): Promise<void> {
    const externalId = pedagogue.id.value;

    const baseData = {
      externalId,
      registration: pedagogue.registrationNumber.value,
      name: pedagogue.name.value,
      email: pedagogue.email.value,
      phoneNumber: pedagogue.phoneNumber.value,
      userStatus: pedagogue.userStatus.value,
      password: pedagogue.password.value,
    };
    await this.prisma.pedagogue.create({
      data: {
        ...baseData,
      },
    });
  }
  async existsByEmail(email: string): Promise<boolean> {
    const account = await this.prisma.pedagogue.findFirst({
      where: {
        email: email,
      },
    });

    return !!account;
  }
  async existsByRegistrationNumber(registrationNumber: string): Promise<boolean> {
    const account = await this.prisma.pedagogue.findFirst({
      where: {
        registration: registrationNumber,
      },
    });

    return !!account;
  }
  //async findByEmail(email: string): Promise<Pedagogue | null> {}
}
