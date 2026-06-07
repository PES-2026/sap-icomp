import { Schedule } from "@domain/entities/schedule";
import { IScheduleRepository } from "@domain/repositories/scheduleRepository";
import { PrismaClient } from "@prisma/src/infrastructure/database/generated/client";

export class PrismaScheduleRepository implements IScheduleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Schedule | null> {
    const raw = await this.prisma.schedule.findUnique({
      where: { externalId: id },
      include: { pedagogue: true },
    });

    if (!raw) return null;

    return Schedule.rehydrate({
      id: raw.externalId,
      pedagogueId: raw.pedagogue.externalId,
      startDate: raw.startDate,
      endDate: raw.endDate,
      removed: raw.removed,
    });
  }

  async findByPedagogueId(pedagogueId: string): Promise<Schedule[]> {
    const results = await this.prisma.schedule.findMany({
      where: {
        pedagogue: { externalId: pedagogueId },
        removed: false,
      },
      include: { pedagogue: true },
    });

    return results.map((raw) =>
      Schedule.rehydrate({
        id: raw.externalId,
        pedagogueId: raw.pedagogue.externalId,
        startDate: raw.startDate,
        endDate: raw.endDate,
        removed: raw.removed,
      }),
    );
  }

  async save(schedule: Schedule): Promise<void> {
    await this.prisma.schedule.upsert({
      where: { externalId: schedule.id.value },
      update: {
        startDate: schedule.startDate.value,
        endDate: schedule.endDate.value,
        removed: schedule.removed,
      },
      create: {
        externalId: schedule.id.value,
        pedagogue: { connect: { externalId: schedule.pedagogueId.value } },
        startDate: schedule.startDate.value,
        endDate: schedule.endDate.value,
        removed: schedule.removed,
      },
    });
  }
}
