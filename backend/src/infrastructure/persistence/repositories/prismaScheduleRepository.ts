import { Schedule } from "@domain/entities/schedule";
import { ScheduleResult } from "@domain/repositories/results/scheduleResult";
import { IScheduleRepository } from "@domain/repositories/scheduleRepository";
import { PrismaClient } from "@prisma/src/infrastructure/database/generated/client";

export class PrismaScheduleRepository implements IScheduleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<ScheduleResult | null> {
    const raw = await this.prisma.schedule.findUnique({
      where: { externalId: id },
      include: { pedagogue: true },
    });

    if (!raw) return null;

    return {
      id: raw.externalId,
      pedagogueId: raw.pedagogue.externalId,
      startDate: raw.startDate,
      endDate: raw.endDate,
      token: raw.token,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  async findByPedagogueId(pedagogueId: string): Promise<ScheduleResult[]> {
    const results = await this.prisma.schedule.findMany({
      where: {
        pedagogue: { externalId: pedagogueId },
        removed: false,
      },
      include: { pedagogue: true },
    });

    const resultsMapped = results.map((raw) => ({
      id: raw.externalId,
      pedagogueId: raw.pedagogue.externalId,
      startDate: raw.startDate,
      endDate: raw.endDate,
      token: raw.token,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }));

    return resultsMapped;
  }

  async save(schedule: Schedule): Promise<void> {
    await this.prisma.schedule.create({
      data: {
        externalId: schedule.id.value,
        pedagogue: { connect: { externalId: schedule.pedagogueId.value } },
        startDate: schedule.startDate.value,
        endDate: schedule.endDate.value,
        removed: schedule.removed,
        token: schedule.token.value,
      },
    });
  }

  async update(schedule: Schedule): Promise<void> {
    await this.prisma.schedule.update({
      where: { externalId: schedule.id.value },
      data: {
        startDate: schedule.startDate.value,
        endDate: schedule.endDate.value,
        removed: schedule.removed,
        token: schedule.token.value,
      },
    });
  }
}
