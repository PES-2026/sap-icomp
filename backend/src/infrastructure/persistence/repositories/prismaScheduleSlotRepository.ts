import { ScheduleSlot } from "@domain/entities/scheduleSlot";
import { ScheduleSlotStatusEnum } from "@domain/enum/scheduleSlotStatus";
import { ScheduleSlotResult } from "@domain/repositories/results/scheduleSlotResult";
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

    if (slot.appointmentId?.value) {
      data.appointment = { connect: { externalId: slot.appointmentId.value } };
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
      where: { externalId: pedagogueId },
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
        appointment: {
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
      appointmentId: slot.appointment?.externalId ?? undefined,
      status: findValueInEnum(ScheduleSlotStatusEnum, slot.status),
      createdAt: slot.createdAt,
      updatedAt: slot.updatedAt,
    }));
  }

  async findAllSlotsByRange(pedagogueId: string, startDate: Date, endDate: Date): Promise<ScheduleSlotResult[]> {
    const pedagogue = await this.prisma.pedagogue.findUnique({
      where: { externalId: pedagogueId },
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
        appointment: {
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
      appointmentId: slot.appointment?.externalId ?? undefined,
      status: findValueInEnum(ScheduleSlotStatusEnum, slot.status),
      createdAt: slot.createdAt,
      updatedAt: slot.updatedAt,
    }));
  }
}
