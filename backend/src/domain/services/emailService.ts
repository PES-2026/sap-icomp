import { CancelledAppointmentPedagogueEmailData } from "./interfaces/cancelledAppointmentPedagogueData";
import { CancelledAppointmentEmailData } from "./interfaces/cancelledAppointmentStudentData";
import { AppointmentConfirmedPedagogueEmailData } from "./interfaces/confirmedAppointmentPedagogueData";
import { AppointmentConfirmedStudentEmailData } from "./interfaces/confirmedAppointmentStudentData";
import { PedagogueAppointmentEmailData } from "./interfaces/pedagogueScheduleEmailData";
import { RescheduledPedagogueAppointmentEmailData } from "./interfaces/rescheduleAppointmentPedagogueData";
import { RescheduledAppointmentStudentEmailData } from "./interfaces/rescheduleAppointmentStudentData";
import { StudentAppointmentEmailData } from "./interfaces/studentAppointmentEmailData";

export interface IEmailService {
  sendPasswordResetEmail(to: string, name: string, token: string): Promise<void>;
  sendAppointmentRequestedStudentEmail(to: string, props: StudentAppointmentEmailData): Promise<void>;
  sendAppointmentRequestedPedagogueEmail(to: string, props: PedagogueAppointmentEmailData): Promise<void>;
  sendAppointmentConfirmedStudentEmail(to: string, props: AppointmentConfirmedStudentEmailData): Promise<void>;
  sendAppointmentConfirmedPedagogueEmail(to: string, props: AppointmentConfirmedPedagogueEmailData): Promise<void>;
  sendAppointmentCancelledStudentEmail(to: string, props: CancelledAppointmentEmailData): Promise<void>;
  sendAppointmentCancelledPedagogueEmail(to: string, props: CancelledAppointmentPedagogueEmailData): Promise<void>;
  sendRescheduledAppointmentPedagogueEmail(to: string, props: RescheduledPedagogueAppointmentEmailData): Promise<void>;
  sendRescheduledAppointmentStudentEmail(to: string, props: RescheduledAppointmentStudentEmailData): Promise<void>;
}
