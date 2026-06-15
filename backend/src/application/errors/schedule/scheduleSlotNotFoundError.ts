import { ApplicationError } from "../applicationError";

export class ScheduleSlotNotFoundError extends ApplicationError {
  constructor(id: string) {
    super(`Schedule slot with ID ${id} was not found. Please verify it!`, 404);
  }
}
