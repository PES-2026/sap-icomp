import { ScheduleSlot } from "../entities/scheduleSlot";

export interface IScheduleSlotRepository {
  findById(id: string): Promise<ScheduleSlot | null>;
  findAvailableInInterval(pedagogueId: string, start: Date, end: Date): Promise<ScheduleSlot[]>;
  updateStatus(id: string, status: string, attendanceId?: string): Promise<void>;
  updateStatusMany(ids: string[], status: string, attendanceId?: string): Promise<void>;
}
