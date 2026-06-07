import { PrismaClient } from "@prisma/src/infrastructure/database/generated/client";
import { IScheduleRepository } from "@domain/repositories/scheduleRepository";
import { Schedule } from "@domain/entities/schedule";
import { ScheduleSlot } from "@domain/entities/scheduleSlot";
import { ScheduleOverlapError } from "@application/errors/schedule/scheduleOverlapError";

export class PrismaScheduleRepository implements IScheduleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(schedule: Schedule, slots: ScheduleSlot[]): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // 1. Get internal pedagogue ID and LOCK the record for concurrency control
      const pedagogues = await tx.$queryRaw<any[]>`
        SELECT "internalId" FROM "Pedagogue" 
        WHERE "externalId" = ${schedule.pedagogueId.value} 
        FOR UPDATE
      `;

      if (pedagogues.length === 0) {
        throw new Error(`Pedagogue with externalId ${schedule.pedagogueId.value} not found`);
      }
      const pedagogueInternalId = pedagogues[0].internalId;

      // 2. Check for overlapping slots in the DB for this pedagogue
      if (slots.length > 0) {
        const minStart = new Date(Math.min(...slots.map((s) => s.startDateTime.value.getTime())));
        const maxEnd = new Date(Math.max(...slots.map((s) => s.endDateTime.value.getTime())));

        const existingSlots = await tx.scheduleSlot.findMany({
          where: {
            schedule: {
              pedagogueId: pedagogueInternalId,
              removed: false,
            },
            startDateTime: { lt: maxEnd },
            endDateTime: { gt: minStart },
          },
          select: {
            startDateTime: true,
            endDateTime: true,
          },
        });

        for (const newSlot of slots) {
          const overlap = existingSlots.find(
            (existing) =>
              newSlot.startDateTime.value < existing.endDateTime &&
              newSlot.endDateTime.value > existing.startDateTime,
          );

          if (overlap) {
            throw new ScheduleOverlapError(
              `Slot [${newSlot.startDateTime.value.toISOString()} - ${newSlot.endDateTime.value.toISOString()}] overlaps with an existing slot in the database.`,
            );
          }
        }
      }

      // 3. Create schedule
      const createdSchedule = await tx.schedule.create({
        data: {
          externalId: schedule.id.value,
          pedagogueId: pedagogueInternalId,
          startDate: schedule.startDate.value,
          endDate: schedule.endDate.value,
        },
      });

      // 4. Create schedule slots
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
