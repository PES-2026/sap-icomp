import { CreateTypeAttendanceDto } from "../../application/dtos/typeAttendance/createTypeAttendance.dto";
import { ITypeAttendanceRepository } from "../../domain/repositories/typeAttendanceRepository";
import {
  PrismaClient,
  Prisma,
} from "../../../prisma/src/infrastructure/database/generated/client";
import { TypeAttendance } from "../../domain/entities/typeAttendance";

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
}
