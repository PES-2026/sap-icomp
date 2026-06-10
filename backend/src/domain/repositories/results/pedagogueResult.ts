import { UserResult } from "./userResult";

export interface PedagogueResult extends UserResult {
  maxAttendanceTime?: number | undefined;
}
