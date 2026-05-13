import { PrismaClient, Prisma } from "../../../prisma/src/infrastructure/database/generated/client";
import { UpdateTypeAttendanceResponse } from "../../application/dtos/typeAttendance/updateTypeAttendance.dto";
import { UpdateTypeAttendance } from "../../application/use-cases/typeAttendance/updateTypeAttendance";
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
}
