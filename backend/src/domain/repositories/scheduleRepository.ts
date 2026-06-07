import { Schedule } from "../entities/schedule";

export interface IScheduleRepository {
  findById(id: string): Promise<Schedule | null>;
  findByPedagogueId(pedagogueId: string): Promise<Schedule[]>;
  save(schedule: Schedule): Promise<void>;
}
