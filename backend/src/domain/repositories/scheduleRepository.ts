import { Schedule } from "../entities/schedule";
import { ScheduleListParams } from "./filters/scheduleFilters";

import { PaginatedScheduleResult, ScheduleResult } from "./results/scheduleResult";

export interface IScheduleRepository {
  findById(id: string): Promise<ScheduleResult | null>;
  findByPedagogueId(pedagogueId: string): Promise<ScheduleResult[]>;
  findAll(params: ScheduleListParams): Promise<PaginatedScheduleResult>;
  save(schedule: Schedule): Promise<void>;
  update(schedule: Schedule): Promise<void>;
}
