import { AccountRequest } from "@domain/entities/accountRequest";
import { IAccountRequestRepository } from "@domain/repositories/accountRequestRepository";
import { PrismaClient } from "@prisma/src/infrastructure/database/generated/client";

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
      ...(accountRequest.role ? { role: accountRequest.role.value } : {}),
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
      role: accountRequest.role || undefined,
      password: accountRequest.password,
      createdAt: accountRequest.createdAt,
    });
  }

  async findAllPending(): Promise<AccountRequest[]> {
    const pendingRequests = await this.prisma.accountRequest.findMany({
      where: {
        userStatus: "PENDING",
        removed: false,
      },
      orderBy: {
        createdAt: "desc",
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
        role: request.role || undefined,
        password: request.password,
        createdAt: request.createdAt,
      }),
    );
  }

  async update(accountRequest: AccountRequest): Promise<void> {
    await this.prisma.accountRequest.update({
      where: {
        externalId: accountRequest.id.value,
      },
      data: {
        userStatus: accountRequest.userStatus.value,
        role: accountRequest.role?.value,
      },
    });
  }
}
