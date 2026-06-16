import { PedagogueScheduleEmailData } from "./interfaces/pedagogueScheduleEmailData";
import { RescheduledPedagogueEmailData } from "./interfaces/reschedulePedagogueData";
import { RescheduledStudentEmailData } from "./interfaces/rescheduleStudentData";
import { CancelledPedagogueEmailData } from "./interfaces/scheduleCancelledPedagogueData";
import { CancelledStudentEmailData } from "./interfaces/scheduleCancelledStudentData";
import { ScheduleConfirmedStudentEmailData } from "./interfaces/scheduleConfirmedStudentData";
import { StudentScheduleEmailData } from "./interfaces/studentScheduleEmailData";

export interface IEmailService {
  sendPasswordResetEmail(to: string, name: string, token: string): Promise<void>;
  sendScheduleRequestedStudentEmail(to: string, props: StudentScheduleEmailData): Promise<void>;
  sendScheduleRequestedPedagogueEmail(to: string, props: PedagogueScheduleEmailData): Promise<void>;
  sendScheduleConfirmedStudentEmail(to: string, props: ScheduleConfirmedStudentEmailData): Promise<void>;
  sendScheduleCancelledStudentEmail(to: string, props: CancelledStudentEmailData): Promise<void>;
  sendScheduleCancelledPedagogueEmail(to: string, props: CancelledPedagogueEmailData): Promise<void>;
  sendRescheduledPedagogueEmail(to: string, props: RescheduledPedagogueEmailData): Promise<void>;
  sendRescheduledStudentEmail(to: string, props: RescheduledStudentEmailData): Promise<void>;
}
