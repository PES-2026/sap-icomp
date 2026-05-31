import {
  IPasswordResetRepository,
  PasswordResetData,
  PasswordResetItem,
} from "../../../domain/repositories/passwordResetRepository";
import { prisma } from "../../persistence/prisma";

export class PrismaPasswordResetRepository implements IPasswordResetRepository {
  async create(data: PasswordResetData): Promise<void> {
    await prisma.passwordReset.create({
      data: {
        token: data.token,
        expiresAt: data.expiresAt,
        professorId: data.professorId,
        pedagogueId: data.pedagogueId,
      },
    });
  }

  async findByToken(token: string): Promise<PasswordResetItem | null> {
    const reset = await prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!reset) return null;

    return {
      internalId: reset.internalId,
      token: reset.token,
      expiresAt: reset.expiresAt,
      createdAt: reset.createdAt,
      usedAt: reset.usedAt,
      professorId: reset.professorId || undefined,
      pedagogueId: reset.pedagogueId || undefined,
    };
  }

  async markAsUsed(internalId: number): Promise<void> {
    await prisma.passwordReset.update({
      where: { internalId },
      data: { usedAt: new Date() },
    });
  }
}
