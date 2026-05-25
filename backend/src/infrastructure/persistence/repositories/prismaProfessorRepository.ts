import { PrismaClient, Prisma } from "@prisma/src/infrastructure/database/generated/client";

import { Professor } from "../../../domain/entities/professor";
import { UserFilters } from "../../../domain/repositories/filters/userFilters";
import { IProfessorRepository } from "../../../domain/repositories/professorRepository";
import { UserListItem } from "../../../domain/repositories/results/userResult";
import { PaginatedResult } from "../../../domain/shared/pagination";

export class PrismaProfessorRepository implements IProfessorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(filters: UserFilters, page: number, limit: number): Promise<PaginatedResult<UserListItem>> {
    const skip = (page - 1) * limit;

    const where: Prisma.ProfessorWhereInput = {
      removed: false,
    };

    if (filters.name) {
      where.name = { contains: filters.name, mode: "insensitive" };
    }

    if (filters.userStatus) {
      where.userStatus = filters.userStatus;
    }

    const [totalItems, professors] = await Promise.all([
      this.prisma.professor.count({ where }),
      this.prisma.professor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
    ]);

    const items: UserListItem[] = professors.map((p) => ({
      id: p.externalId,
      name: p.name,
      email: p.email,
      phoneNumber: p.phoneNumber || "",
      registrationNumber: p.registration,
      role: "PROFESSOR",
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
