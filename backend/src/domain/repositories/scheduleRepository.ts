import { Schedule } from "../entities/schedule";

import { ScheduleResult } from "./results/scheduleResult";

export interface IScheduleRepository {
  findById(id: string): Promise<ScheduleResult | null>;
  findByPedagogueId(pedagogueId: string): Promise<ScheduleResult[]>;
  save(schedule: Schedule): Promise<void>;
  update(schedule: Schedule): Promise<void>;
}
