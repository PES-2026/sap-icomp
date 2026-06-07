import { Schedule } from "../entities/schedule";
import { ScheduleSlot } from "../entities/scheduleSlot";

export interface IScheduleRepository {
  save(schedule: Schedule, slots: ScheduleSlot[]): Promise<void>;
}
