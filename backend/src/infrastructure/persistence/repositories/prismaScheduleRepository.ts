import { PrismaClient } from "@prisma/src/infrastructure/database/generated/client";
import { IScheduleRepository } from "@domain/repositories/scheduleRepository";
import { Schedule } from "@domain/entities/schedule";
import { ScheduleSlot } from "@domain/entities/scheduleSlot";

export class PrismaScheduleRepository implements IScheduleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(schedule: Schedule, slots: ScheduleSlot[]): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      //tx is the transactional PrismaClient instance that should be used for all database operations within this transaction
      // 1. Get internal pedagogue ID
      const pedagogue = await tx.pedagogue.findUnique({
        where: { externalId: schedule.pedagogueId.value },
        select: { internalId: true },
      });

      if (!pedagogue) {
        throw new Error(`Pedagogue with externalId ${schedule.pedagogueId.value} not found`);
      }

      // 2. Create schedule
      const createdSchedule = await tx.schedule.create({
        data: {
          externalId: schedule.id.value,
          pedagogueId: pedagogue.internalId,
          startDate: schedule.startDate.value,
          endDate: schedule.endDate.value,
        },
      });

      // 3. Create schedule slots
      if (slots.length > 0) {
        await tx.scheduleSlot.createMany({
          data: slots.map((slot) => ({
            externalId: slot.id.value,
            scheduleId: createdSchedule.internalId,
            startDateTime: slot.startDateTime.value,
            endDateTime: slot.endDateTime.value,
            status: slot.status,
          })),
        });
      }
    });
  }
}
