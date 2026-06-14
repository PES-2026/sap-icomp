import { ScheduleSlot } from "../entities/scheduleSlot";

import { ScheduleSlotResult } from "./results/scheduleSlotResult";

export interface IScheduleSlotRepository {
  save(slot: ScheduleSlot): Promise<void>;
  saveMany(slots: ScheduleSlot[]): Promise<void>;
  deleteAvailableSlotsByRange(pedagogueId: string, startDate: Date, endDate: Date): Promise<number>;
  findBookedSlotsByRange(pedagogueId: string, startDate: Date, endDate: Date): Promise<ScheduleSlotResult[]>;
  findAllSlotsByRange(pedagogueId: string, startDate: Date, endDate: Date): Promise<ScheduleSlotResult[]>;
}
