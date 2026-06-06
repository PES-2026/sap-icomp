import {
  IPasswordResetRepository,
  PasswordResetData,
  PasswordResetItem,
} from "@domain/repositories/passwordResetRepository";
import { Prisma } from "@prisma/src/infrastructure/database/generated/client";

import { prisma } from "../../persistence/prisma";

export class PrismaPasswordResetRepository implements IPasswordResetRepository {
  async create(data: PasswordResetData): Promise<void> {
    const createData: Prisma.PasswordResetCreateInput = {
      token: data.token,
      expiresAt: data.expiresAt,
    };

    if (data.professorId) {
      createData.professor = { connect: { externalId: data.professorId } };
    }

    if (data.pedagogueId) {
      createData.pedagogue = { connect: { externalId: data.pedagogueId } };
    }

    await prisma.passwordReset.create({
      data: createData,
    });
  }

  async findByToken(token: string): Promise<PasswordResetItem | null> {
    const reset = await prisma.passwordReset.findUnique({
      where: { token },
      include: {
        professor: true,
        pedagogue: true,
      },
    });

    if (!reset) return null;

    return {
      internalId: reset.internalId,
      token: reset.token,
      expiresAt: reset.expiresAt,
      createdAt: reset.createdAt,
      usedAt: reset.usedAt,
      professorId: reset.professor?.externalId || undefined,
      pedagogueId: reset.pedagogue?.externalId || undefined,
    };
  }

  async markAsUsed(internalId: number): Promise<void> {
    await prisma.passwordReset.update({
      where: { internalId },
      data: { usedAt: new Date() },
    });
  }
}
