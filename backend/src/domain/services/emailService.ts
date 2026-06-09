import { PedagogueScheduleEmailData } from "./interfaces/pedagogueScheduleEmailData";
import { StudentScheduleEmailData } from "./interfaces/studentScheduleEmailData";

export interface IEmailService {
  sendPasswordResetEmail(to: string, name: string, token: string): Promise<void>;
  sendScheduleRequestedStudentEmail(to: string, props: StudentScheduleEmailData): Promise<void>;
  sendScheduleRequestedPedagogueEmail(to: string, props: PedagogueScheduleEmailData): Promise<void>;
}
