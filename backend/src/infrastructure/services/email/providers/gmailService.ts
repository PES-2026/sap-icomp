import path from "node:path";
import { fileURLToPath } from "node:url";

import nodemailer from "nodemailer";

import { IEmailService } from "@domain/services/emailService";
import { CancelledAppointmentPedagogueEmailData } from "@domain/services/interfaces/cancelledAppointmentPedagogueData";
import { CancelledAppointmentEmailData } from "@domain/services/interfaces/cancelledAppointmentStudentData";
import { AppointmentConfirmedPedagogueEmailData } from "@domain/services/interfaces/confirmedAppointmentPedagogueData";
import { AppointmentConfirmedStudentEmailData } from "@domain/services/interfaces/confirmedAppointmentStudentData";
import { PedagogueAppointmentEmailData } from "@domain/services/interfaces/pedagogueScheduleEmailData";
import { RescheduledPedagogueAppointmentEmailData } from "@domain/services/interfaces/rescheduleAppointmentPedagogueData";
import { RescheduledAppointmentStudentEmailData } from "@domain/services/interfaces/rescheduleAppointmentStudentData";
import { StudentAppointmentEmailData } from "@domain/services/interfaces/studentAppointmentEmailData";
import { env } from "@infrastructure/config/env";

import { buildAppointmentCancelledPedagogueTemplate } from "../templates/appointmentCancelledPedagogueTemplate";
import { buildAppointmentCancelledStudentTemplate } from "../templates/appointmentCancelledStudentTemplate";
import { buildAppointmentConfirmedPedagogueTemplate } from "../templates/appointmentConfirmedPedagogueTemplate";
import { buildAppointmentConfirmedStudentTemplate } from "../templates/appointmentConfirmedStudentTemplate";
import { buildAppointmentRequestedPedagogueTemplate } from "../templates/appointmentRequestedPedagogueTemplate";
import { buildAppointmentRequestedStudentTemplate } from "../templates/appointmentRequestedStudentTemplate";
import { buildPasswordResetTemplate } from "../templates/passwordResetTemplate";
import { buildRescheduledPedagogueTemplate } from "../templates/reschedulePedagogueTemplate";
import { buildRescheduledStudentTemplate } from "../templates/rescheduleStudentTemplate";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env.GMAIL_USER,
        pass: env.GMAIL_APP_PASSWORD,
      },
    });
  }

  private async sendEmail(mailOptions: nodemailer.SendMailOptions): Promise<void> {
    const logoPath = path.join(__dirname, "../../../assets/images/SAPICompLogoHorizontal.png");

    mailOptions.from = env.GMAIL_USER;
    mailOptions.attachments = [
      {
        filename: "logo.png",
        path: logoPath,
        cid: "logo",
      },
    ];

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(to: string, name: string, token: string): Promise<void> {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
      to,
      subject: "Recuperação de Senha - SAP ICOMP",
      html: buildPasswordResetTemplate({ name, resetUrl }),
    };

    await this.sendEmail(mailOptions);
  }

  async sendAppointmentRequestedStudentEmail(to: string, props: StudentAppointmentEmailData): Promise<void> {
    const cancelLink = `${env.FRONTEND_URL}/appointment/cancel?token=${props.token}`;
    const rescheduleLink = `${env.FRONTEND_URL}/appointment/reschedule?token=${props.token}`;

    const mailOptions = {
      to,
      subject: "Agendamento Solicitado - SAP ICOMP",
      html: buildAppointmentRequestedStudentTemplate(props, rescheduleLink, cancelLink),
    };

    await this.sendEmail(mailOptions);
  }

  async sendAppointmentRequestedPedagogueEmail(to: string, props: PedagogueAppointmentEmailData): Promise<void> {
    const dashboardLink = `${env.FRONTEND_URL}/pedagogue/scheduling`;
    const mailOptions = {
      to,
      subject: "Nova solicitação de agendamento - SAP ICOMP",
      html: buildAppointmentRequestedPedagogueTemplate(props, dashboardLink),
    };

    await this.sendEmail(mailOptions);
  }

  async sendAppointmentConfirmedStudentEmail(to: string, props: AppointmentConfirmedStudentEmailData): Promise<void> {
    const cancelLink = `${env.FRONTEND_URL}/appointment/cancel?token=${props.token}`;
    const rescheduleLink = `${env.FRONTEND_URL}/appointment/reschedule?token=${props.token}`;

    const mailOptions = {
      to,
      subject: "Agendamento Confirmado - SAP ICOMP",
      html: buildAppointmentConfirmedStudentTemplate(props, rescheduleLink, cancelLink),
    };

    await this.sendEmail(mailOptions);
  }

  async sendAppointmentConfirmedPedagogueEmail(
    to: string,
    props: AppointmentConfirmedPedagogueEmailData,
  ): Promise<void> {
    const dashboardLink = `${env.FRONTEND_URL}/pedagogue/scheduling`;
    const mailOptions = {
      to,
      subject: "Agendamento Confirmado - SAP ICOMP",
      html: buildAppointmentConfirmedPedagogueTemplate(props, dashboardLink),
    };

    await this.sendEmail(mailOptions);
  }

  async sendAppointmentCancelledStudentEmail(to: string, props: CancelledAppointmentEmailData): Promise<void> {
    const mailOptions = {
      to,
      subject: "Agendamento Cancelado - SAP ICOMP",
      html: buildAppointmentCancelledStudentTemplate(props),
    };

    await this.sendEmail(mailOptions);
  }

  async sendAppointmentCancelledPedagogueEmail(
    to: string,
    props: CancelledAppointmentPedagogueEmailData,
  ): Promise<void> {
    const mailOptions = {
      to,
      subject: "Agendamento Cancelado pelo Aluno - SAP ICOMP",
      html: buildAppointmentCancelledPedagogueTemplate(props),
    };

    await this.sendEmail(mailOptions);
  }

  async sendRescheduledAppointmentPedagogueEmail(
    to: string,
    props: RescheduledPedagogueAppointmentEmailData,
  ): Promise<void> {
    const dashboardLink = `${env.FRONTEND_URL}/pedagogue/scheduling`;
    const mailOptions = {
      to,
      subject: "Agendamento Remarcado - SAP ICOMP",
      html: buildRescheduledPedagogueTemplate(props, dashboardLink),
    };

    await this.sendEmail(mailOptions);
  }

  async sendRescheduledAppointmentStudentEmail(
    to: string,
    props: RescheduledAppointmentStudentEmailData,
  ): Promise<void> {
    const cancelLink = `${env.FRONTEND_URL}/appointment/cancel?token=${props.token}`;
    const rescheduleLink = `${env.FRONTEND_URL}/appointment/reschedule?token=${props.token}`;

    const mailOptions = {
      to,
      subject: "Agendamento Remarcado - SAP ICOMP",
      html: buildRescheduledStudentTemplate(props, rescheduleLink, cancelLink),
    };

    await this.sendEmail(mailOptions);
  }
}
