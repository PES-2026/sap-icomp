import { PrismaClient, Prisma } from "@prisma/src/infrastructure/database/generated/client";

import { Pedagogue } from "../../../domain/entities/pedagogue";
import { UserFilters } from "../../../domain/repositories/filters/userFilters";
import { IPedagogueRepository } from "../../../domain/repositories/pedagogueRepository";
import { UserListItem } from "../../../domain/repositories/results/userResult";
import { PaginatedResult } from "../../../domain/shared/pagination";

export class PrismaPedagogueRepository implements IPedagogueRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(filters: UserFilters, page: number, limit: number): Promise<PaginatedResult<UserListItem>> {
    const skip = (page - 1) * limit;

    const where: Prisma.PedagogueWhereInput = {
      removed: false,
    };

    if (filters.name) {
      where.name = { contains: filters.name, mode: "insensitive" };
    }

    if (filters.userStatus) {
      where.userStatus = filters.userStatus;
    }

    const [totalItems, pedagogues] = await Promise.all([
      this.prisma.pedagogue.count({ where }),
      this.prisma.pedagogue.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
    ]);

    const items: UserListItem[] = pedagogues.map((p) => ({
      id: p.externalId,
      name: p.name,
      email: p.email,
      phoneNumber: p.phoneNumber || "",
      registrationNumber: p.registration,
      role: "PEDAGOGUE",
      userStatus: p.userStatus,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      items,
    };
  }

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
