import { RoleEnum } from "@domain/enum/role";
import { PrismaClient, Prisma } from "@prisma/src/infrastructure/database/generated/client";

import { Professor } from "../../../domain/entities/professor";
import { UserFilters } from "../../../domain/repositories/filters/userFilters";
import { IProfessorRepository } from "../../../domain/repositories/professorRepository";
import { UserItem } from "../../../domain/repositories/results/userResult";
import { PaginatedResult } from "../../../domain/shared/pagination";

import { UserAuthResult } from "@domain/repositories/results/userAuthResult";

export class PrismaProfessorRepository implements IProfessorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(filters: UserFilters, page: number, limit: number): Promise<PaginatedResult<UserItem>> {
    const skip = (page - 1) * limit;

    const where: Prisma.ProfessorWhereInput = {
      removed: false,
    };

    if (filters.name) {
      where.name = { contains: filters.name, mode: "insensitive" };
    }

    if (filters.userStatus) {
      where.userStatus = filters.userStatus as PrismaUserStatus;
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

    const items: UserItem[] = professors.map((p) => ({
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
      password: professor.password!.value,
    };
    await this.prisma.professor.create({
      data: {
        ...baseData,
      },
    });
  }

  async findById(id: string): Promise<UserItem | null> {
    const raw = await this.prisma.professor.findUnique({
      where: { externalId: id },
    });

    if (!raw) return null;

    return {
      id: raw.externalId,
      name: raw.name,
      email: raw.email,
      phoneNumber: raw.phoneNumber || "",
      registrationNumber: raw.registration,
      userStatus: raw.userStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      role: RoleEnum.PROFESSOR,
    };
  }

  async findByEmail(email: string): Promise<UserItem | null> {
    const raw = await this.prisma.professor.findUnique({
      where: { email },
    });

    if (!raw) return null;

    return {
      id: raw.externalId,
      name: raw.name,
      email: raw.email,
      phoneNumber: raw.phoneNumber || "",
      registrationNumber: raw.registration,
      userStatus: raw.userStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      role: RoleEnum.PROFESSOR,
    };
  }

  async update(professor: Professor): Promise<void> {
    const passwordValue = professor.password ? professor.password.value : undefined;

    await this.prisma.professor.update({
      where: { externalId: professor.id.value },
      data: {
        name: professor.name.value,
        email: professor.email.value,
        phoneNumber: professor.phoneNumber.value,
        registration: professor.registrationNumber.value,
        userStatus: professor.userStatus.value,
      },
    });
    if (passwordValue) {
      await this.prisma.professor.update({
        where: { externalId: professor.id.value },
        data: {
          password: passwordValue,
        },
      });
    }
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

  async remove(id: string): Promise<void> {
    await this.prisma.professor.update({
      where: { externalId: id },
      data: {
        removed: true,
        userStatus: "DISABLED",
      },
    });
  }
}
