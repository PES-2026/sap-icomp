import { ScheduleSlot } from "@domain/entities/scheduleSlot";
import { ScheduleSlotStatusEnum } from "@domain/enum/scheduleSlotStatus";
import { IScheduleSlotRepository } from "@domain/repositories/scheduleSlotRepository";
import { PrismaClient, ScheduleSlotStatus } from "@prisma/src/infrastructure/database/generated/client";

export class PrismaScheduleSlotRepository implements IScheduleSlotRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<ScheduleSlot | null> {
    const raw = await this.prisma.scheduleSlot.findUnique({
      where: { externalId: id },
      include: { schedule: { include: { pedagogue: true } }, attendance: true },
    });

    if (!raw) return null;

    return ScheduleSlot.rehydrate({
      id: raw.externalId,
      scheduleId: raw.schedule.externalId,
      startDateTime: raw.startDateTime,
      endDateTime: raw.endDateTime,
      status: raw.status as ScheduleSlotStatusEnum,
      attendanceId: raw.attendance?.externalId,
    });
  }

  async findAvailableInInterval(pedagogueId: string, start: Date, end: Date): Promise<ScheduleSlot[]> {
    const results = await this.prisma.scheduleSlot.findMany({
      where: {
        schedule: { pedagogue: { externalId: pedagogueId } },
        startDateTime: { gte: start },
        endDateTime: { lte: end },
        status: ScheduleSlotStatus.AVAILABLE,
      },
      include: { schedule: { include: { pedagogue: true } }, attendance: true },
      orderBy: { startDateTime: "asc" },
    });

    return results.map((raw) =>
      ScheduleSlot.rehydrate({
        id: raw.externalId,
        scheduleId: raw.schedule.externalId,
        startDateTime: raw.startDateTime,
        endDateTime: raw.endDateTime,
        status: raw.status as ScheduleSlotStatusEnum,
        attendanceId: raw.attendance?.externalId,
      }),
    );
  }

  async updateStatus(id: string, status: string, attendanceId?: string): Promise<void> {
    const attendance = attendanceId
      ? await this.prisma.attendance.findUnique({ where: { externalId: attendanceId } })
      : null;

    await this.prisma.scheduleSlot.update({
      where: { externalId: id },
      data: {
        status: status as ScheduleSlotStatus,
        attendanceId: attendance?.internalId ?? null,
      },
    });
  }

  async updateStatusMany(ids: string[], status: string, attendanceId?: string): Promise<void> {
    const attendance = attendanceId
      ? await this.prisma.attendance.findUnique({ where: { externalId: attendanceId } })
      : null;

    await this.prisma.$transaction(async (tx) => {
      const availableSlots = await tx.scheduleSlot.findMany({
        where: {
          externalId: { in: ids },
          status: ScheduleSlotStatus.AVAILABLE,
        },
      });

      if (availableSlots.length !== ids.length) {
        throw new Error("Some selected slots are no longer available.");
      }

      await tx.scheduleSlot.updateMany({
        where: { externalId: { in: ids } },
        data: {
          status: status as ScheduleSlotStatus,
          attendanceId: attendance?.internalId ?? null,
        },
      });
    });
  }
}
