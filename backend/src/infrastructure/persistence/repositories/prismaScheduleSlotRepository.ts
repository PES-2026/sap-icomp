import { ScheduleSlot } from "@domain/entities/scheduleSlot";
import { ScheduleSlotStatusEnum } from "@domain/enum/scheduleSlotStatus";
import { ScheduleSlotListParams } from "@domain/repositories/filters/scheduleSlotFilters";
import { PaginatedScheduleSlotResult, ScheduleSlotResult } from "@domain/repositories/results/scheduleSlotResult";
import { IScheduleSlotRepository } from "@domain/repositories/scheduleSlotRepository";
import { findValueInEnum } from "@domain/utils/enumUtils";
import { Prisma, PrismaClient, ScheduleSlotStatus } from "@prisma/src/infrastructure/database/generated/client";

export class PrismaScheduleSlotRepository implements IScheduleSlotRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(slot: ScheduleSlot): Promise<void> {
    const data: Prisma.ScheduleSlotCreateInput = {
      externalId: slot.id.value,
      pedagogue: { connect: { externalId: slot.pedagogueId.value } },
      startDateTime: slot.startDateTime.value,
      endDateTime: slot.endDateTime.value,
      attendanceTime: slot.attendanceTime.value,
      status: slot.status.value as ScheduleSlotStatus,
    };

    if (slot.scheduleId?.value) {
      data.schedule = { connect: { externalId: slot.scheduleId.value } };
    }

    await this.prisma.scheduleSlot.create({ data });
  }

  async saveMany(slots: ScheduleSlot[]): Promise<void> {
    if (slots.length === 0) return;

    const pedagogueExternalId = slots[0]!.pedagogueId.value;
    const pedagogue = await this.prisma.pedagogue.findUnique({
      where: { externalId: pedagogueExternalId },
      select: { internalId: true },
    });

    if (!pedagogue) throw new Error(`Pedagogue with ID ${pedagogueExternalId} not found`);

    await this.prisma.scheduleSlot.createMany({
      data: slots.map((slot) => ({
        externalId: slot.id.value,
        pedagogueId: pedagogue.internalId,
        startDateTime: slot.startDateTime.value,
        endDateTime: slot.endDateTime.value,
        attendanceTime: slot.attendanceTime.value,
        status: slot.status.value as ScheduleSlotStatus,
      })),
    });
  }

  async deleteAvailableSlotsByRange(pedagogueId: string, startDate: Date, endDate: Date): Promise<number> {
    const pedagogue = await this.prisma.pedagogue.findUnique({
      where: { externalId: pedagogueId },
      select: { internalId: true },
    });

    if (!pedagogue) return 0;

    const result = await this.prisma.scheduleSlot.deleteMany({
      where: {
        pedagogueId: pedagogue.internalId,
        status: ScheduleSlotStatusEnum.CREATED as ScheduleSlotStatus,
        startDateTime: { gte: startDate },
        endDateTime: { lte: endDate },
      },
    });

    return result.count;
  }

  async findBookedSlotsByRange(pedagogueId: string, startDate: Date, endDate: Date): Promise<ScheduleSlotResult[]> {
    const pedagogue = await this.prisma.pedagogue.findUnique({
      where: { externalId: pedagogueId, removed: false },
      select: { internalId: true },
    });

    if (!pedagogue) return [];

    const slots = await this.prisma.scheduleSlot.findMany({
      where: {
        pedagogueId: pedagogue.internalId,
        status: {
          in: [ScheduleSlotStatusEnum.BOOKED, ScheduleSlotStatusEnum.PENDING],
        },
        startDateTime: { gte: startDate },
        endDateTime: { lte: endDate },
      },
      include: {
        schedule: {
          include: {
            student: {
              select: { name: true },
            },
          },
        },
      },
    });

    return slots.map((slot) => ({
      id: slot.externalId,
      pedagogueId: pedagogueId,
      startDateTime: slot.startDateTime,
      endDateTime: slot.endDateTime,
      attendanceTime: slot.attendanceTime,
      scheduleId: slot.schedule?.externalId ?? undefined,
      status: findValueInEnum(ScheduleSlotStatusEnum, slot.status),
      createdAt: slot.createdAt,
      updatedAt: slot.updatedAt,
    }));
  }

  async findAllSlotsByRange(pedagogueId: string, startDate: Date, endDate: Date): Promise<ScheduleSlotResult[]> {
    const pedagogue = await this.prisma.pedagogue.findUnique({
      where: { externalId: pedagogueId, removed: false },
      select: { internalId: true },
    });

    if (!pedagogue) return [];

    const slots = await this.prisma.scheduleSlot.findMany({
      where: {
        pedagogueId: pedagogue.internalId,
        startDateTime: { gte: startDate },
        endDateTime: { lte: endDate },
      },
      include: {
        schedule: {
          include: {
            student: {
              select: { name: true },
            },
          },
        },
      },
    });

    return slots.map((slot) => ({
      id: slot.externalId,
      pedagogueId: pedagogueId,
      startDateTime: slot.startDateTime,
      endDateTime: slot.endDateTime,
      attendanceTime: slot.attendanceTime,
      scheduleId: slot.schedule?.externalId ?? undefined,
      status: findValueInEnum(ScheduleSlotStatusEnum, slot.status),
      createdAt: slot.createdAt,
      updatedAt: slot.updatedAt,
    }));
  }

  async findAvailableSlotsInInterval(
    pedagogueId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ScheduleSlotResult[]> {
    const pedagogue = await this.prisma.pedagogue.findUnique({
      where: { externalId: pedagogueId, removed: false },
    });

    if (!pedagogue) return [];

    const slots = await this.prisma.scheduleSlot.findMany({
      where: {
        pedagogueId: pedagogue.internalId,
        status: ScheduleSlotStatus.CREATED,
        startDateTime: { gte: startDate },
        endDateTime: { lte: endDate },
      },
    });

    return slots.map((slot) => ({
      id: slot.externalId,
      pedagogueId: pedagogueId,
      startDateTime: slot.startDateTime,
      endDateTime: slot.endDateTime,
      attendanceTime: slot.attendanceTime,
      scheduleId: undefined,
      status: findValueInEnum(ScheduleSlotStatusEnum, slot.status),
      createdAt: slot.createdAt,
      updatedAt: slot.updatedAt,
    }));
  }

  async findById(id: string): Promise<ScheduleSlotResult | null> {
    const slot = await this.prisma.scheduleSlot.findUnique({
      where: {
        externalId: id,
        removed: false,
      },
      include: { pedagogue: { select: { externalId: true } } },
    });

    if (!slot) return null;

    return {
      id: slot.externalId,
      pedagogueId: slot.pedagogue.externalId,
      startDateTime: slot.startDateTime,
      endDateTime: slot.endDateTime,
      attendanceTime: slot.attendanceTime,
      scheduleId: undefined,
      status: findValueInEnum(ScheduleSlotStatusEnum, slot.status),
      createdAt: slot.createdAt,
      updatedAt: slot.updatedAt,
    };
  }

  async findAll(params: ScheduleSlotListParams): Promise<PaginatedScheduleSlotResult> {
    const { page, limit, filters } = params;
    const offset = (page - 1) * limit;

    const pedagogue = filters.pedagogueId
      ? await this.prisma.pedagogue.findUnique({
          where: { externalId: filters.pedagogueId },
          select: { internalId: true },
        })
      : null;

    const where: Prisma.ScheduleSlotWhereInput = {
      ...(pedagogue && { pedagogueId: pedagogue.internalId }),
      ...(filters.status && { status: filters.status as ScheduleSlotStatus }),
      ...(filters.attendanceTime && { attendanceTime: filters.attendanceTime }),
      ...(filters.date && {
        startDateTime: {
          gte: new Date(new Date(filters.date).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(filters.date).setHours(23, 59, 59, 999)),
        },
      }),
      ...(filters.startDate && { startDateTime: { gte: filters.startDate } }),
      ...(filters.endDate && { endDateTime: { lte: filters.endDate } }),
      removed: false,
    };

    const [totalItems, results] = await Promise.all([
      this.prisma.scheduleSlot.count({ where }),
      this.prisma.scheduleSlot.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { startDateTime: "asc" },
        include: {
          pedagogue: { select: { externalId: true } },
          schedule: { select: { externalId: true } },
        },
      }),
    ]);

    const items: ScheduleSlotResult[] = results.map((record) => ({
      id: record.externalId,
      pedagogueId: record.pedagogue.externalId,
      startDateTime: record.startDateTime,
      endDateTime: record.endDateTime,
      attendanceTime: record.attendanceTime,
      scheduleId: record.schedule?.externalId,
      status: findValueInEnum(ScheduleSlotStatusEnum, record.status),
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

  async remove(id: string): Promise<boolean> {
    try {
      await this.prisma.scheduleSlot.update({
        where: { externalId: id },
        data: { removed: true },
      });
      return true;
    } catch (_error) {
      return false;
    }
  }

  async removeMany(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0;

    const result = await this.prisma.scheduleSlot.updateMany({
      where: {
        externalId: { in: ids },
      },
      data: {
        removed: true,
      },
    });

    return result.count;
  }

  async existsByUUID(id: string): Promise<boolean> {
    const slot = await this.prisma.scheduleSlot.findUnique({
      where: { externalId: id, removed: false },
      select: { internalId: true },
    });
    return !!slot;
  }

  async updateStatusMany(ids: string[], status: string, scheduleId: string): Promise<void> {
    if (ids.length === 0) return;

    await this.prisma.scheduleSlot.updateMany({
      where: {
        externalId: { in: ids },
      },
      data: {
        status: status as ScheduleSlotStatus,
      },
    });

    const schedule = await this.prisma.schedule.findUnique({
      where: { externalId: scheduleId },
      select: { internalId: true },
    });

    if (schedule) {
      await this.prisma.scheduleSlot.updateMany({
        where: {
          externalId: { in: ids },
        },
        data: {
          scheduleId: schedule.internalId,
        },
      });
    }
  }

  async updateStatusUnique(id: string, status: string, scheduleId: string): Promise<void> {
    if (id.length === 0) return;

    await this.prisma.scheduleSlot.update({
      where: {
        externalId: id,
        removed: false,
      },
      data: {
        status: status as ScheduleSlotStatus,
      },
    });

    const schedule = await this.prisma.schedule.findUnique({
      where: { externalId: scheduleId, removed: false },
      select: { internalId: true },
    });

    if (schedule) {
      await this.prisma.scheduleSlot.update({
        where: {
          externalId: id,
        },
        data: {
          scheduleId: schedule.internalId,
        },
      });
    } else {
      throw new Error(`Schedule not found for id: ${scheduleId}`);
    }
  }
}
