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
      userStatus: accountRequest.userStatus.value,
      ...(accountRequest.userType ? { role: accountRequest.userType.value as any } : {}),
    };
    await this.prisma.accountRequest.create({
      data: {
        ...baseData,
      },
    });
  }

  async findById(id: string): Promise<AccountRequest | null> {
    const accountRequest = await this.prisma.accountRequest.findUnique({
      where: {
        externalId: id,
      },
    });

    if (!accountRequest) {
      return null;
    }

    return AccountRequest.rehydrate({
      id: accountRequest.externalId,
      name: accountRequest.name,
      email: accountRequest.email,
      phoneNumber: accountRequest.phoneNumber || "",
      registrationNumber: accountRequest.registration,
      userStatus: accountRequest.userStatus,
      userType: accountRequest.role || undefined,
      password: accountRequest.password,
    });
  }

  async findAllPending(): Promise<AccountRequest[]> {
    const pendingRequests = await this.prisma.accountRequest.findMany({
      where: {
        userStatus: "PENDING",
        removed: false,
      },
    });

    return pendingRequests.map((request) =>
      AccountRequest.rehydrate({
        id: request.externalId,
        name: request.name,
        email: request.email,
        phoneNumber: request.phoneNumber || "",
        registrationNumber: request.registration,
        userStatus: request.userStatus,
        userType: request.role || undefined,
        password: request.password,
      }),
    );
  }

  async update(accountRequest: AccountRequest): Promise<void> {
    await this.prisma.accountRequest.update({
      where: {
        externalId: accountRequest.id.value,
      },
      data: {
        userStatus: accountRequest.userStatus.value as any,
        role: accountRequest.userType?.value as any,
      },
    });
  }
}
