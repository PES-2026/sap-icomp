import { Prisma, PrismaClient } from "../../../prisma/src/infrastructure/database/generated/client";
import {
  ListTypeAttendanceRequest,
  ListTypeAttendanceResponse,
} from "../../application/dtos/typeAttendance/listTypeAttendance.dto";
import { TypeAttendanceByIdResponse } from "../../application/dtos/typeAttendance/typeAttendanceById.dto";
import { UpdateTypeAttendanceResponse } from "../../application/dtos/typeAttendance/updateTypeAttendance.dto";
import { TypeAttendance } from "../../domain/entities/typeAttendance";
import { ITypeAttendanceRepository } from "../../domain/repositories/typeAttendanceRepository";
export class PrismaTypeAttendanceRepository implements ITypeAttendanceRepository {
  constructor(private prisma: PrismaClient) {}

  // Implementação usando Prisma para salvar o tipo de atendimento no banco de dados
  async save(typeAttendance: TypeAttendance): Promise<void> {
    await this.prisma.typeAttendance.create({
      data: {
        externalId: typeAttendance.externalId.value,
        name: typeAttendance.name.value,
      },
    });
  }
  async update(typeAttendance: TypeAttendance): Promise<UpdateTypeAttendanceResponse> {
    const response = await this.prisma.typeAttendance.update({
      where: { externalId: typeAttendance.externalId.value },
      data: {
        name: typeAttendance.name.value,
      },
    });

    return {
      name: response.name,
      externalId: response.externalId,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }
  async findAll(params: ListTypeAttendanceRequest): Promise<ListTypeAttendanceResponse> {
    const { page, limit, filters } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.TypeAttendanceWhereInput = {
      removed: false,
      ...(filters.name && {
        name: { contains: filters.name, mode: "insensitive" },
      }),
    };

    const [totalItems, results] = await Promise.all([
      //maybe prisma.typeAttendance doesn't exist, check if it is correct when you rebase and schema is updated.
      this.prisma.typeAttendance.count({ where }),
      this.prisma.typeAttendance.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
    ]);

    const items: ListTypeAttendanceResponse["items"] = results.map((record) => ({
      externalId: record.externalId,
      name: record.name,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }));
    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      items,
    };
  }
  async findById(externalId: string): Promise<TypeAttendanceByIdResponse | null> {
    const record = await this.prisma.typeAttendance.findUnique({
      where: { externalId, removed: false },
    });

    if (!record) return null;

    return {
      externalId: record.externalId,
      name: record.name,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
  async remove(id: string): Promise<void> {
    await this.prisma.typeAttendance.update({
      where: { externalId: id },
      data: { removed: true },
    });
  }
}
