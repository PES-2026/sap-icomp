import { AccountRequest } from "@domain/entities/accountRequest";
import { IAccountRequestRepository } from "@domain/repositories/AccountRequestRepository";
import { PrismaClient, Prisma } from "@prisma/src/infrastructure/database/generated/client";

export class PrismaAccountRequestRepository implements IAccountRequestRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(accountRequest: AccountRequest): Promise<void> {
    const externalId = accountRequest.id.value;

    const baseData = {
      externalId,
      registration: accountRequest.registrationNumber.value,
      name: accountRequest.name.value,
      email: accountRequest.email.value,
      phoneNumber: accountRequest.phoneNumber.value,
      password: accountRequest.password.value,
      role: accountRequest.userType.value,
      userStatus: accountRequest.userStatus.value,
    };
    await this.prisma.accountRequest.create({
      data: {
        ...baseData,
      },
    });
  }
}
