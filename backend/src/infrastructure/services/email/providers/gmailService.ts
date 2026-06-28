import path from "node:path";
import { fileURLToPath } from "node:url";

import nodemailer from "nodemailer";

import { IEmailService } from "@domain/services/emailService";
import { PedagogueScheduleEmailData } from "@domain/services/interfaces/pedagogueScheduleEmailData";
import { RescheduledPedagogueEmailData } from "@domain/services/interfaces/reschedulePedagogueData";
import { RescheduledStudentEmailData } from "@domain/services/interfaces/rescheduleStudentData";
import { CancelledPedagogueEmailData } from "@domain/services/interfaces/scheduleCancelledPedagogueData";
import { CancelledStudentEmailData } from "@domain/services/interfaces/scheduleCancelledStudentData";
import { ScheduleConfirmedStudentEmailData } from "@domain/services/interfaces/scheduleConfirmedStudentData";
import { StudentScheduleEmailData } from "@domain/services/interfaces/studentScheduleEmailData";
import { env } from "@infrastructure/config/env";

import { buildPasswordResetTemplate } from "../templates/passwordResetTemplate";
import { buildRescheduledPedagogueTemplate } from "../templates/reschedulePedagogueTemplate";
import { buildRescheduledStudentTemplate } from "../templates/rescheduleStudentTemplate";
import { buildCancelledPedagogueTemplate } from "../templates/scheduleCancelledPedagogueTemplate";
import { buildCancelledScheduleStudentTemplate } from "../templates/scheduleCancelledStudentTemplate";
import { buildScheduleConfirmedStudentTemplate } from "../templates/scheduleConfirmedStudentTemplate";
import { buildSchedulePedagogueTemplate } from "../templates/scheduleRequestedPedagogueTemplate";
import { buildScheduleStudentTemplate } from "../templates/scheduleRequestedStudentTemplate";

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

  async sendScheduleRequestedStudentEmail(to: string, props: StudentScheduleEmailData): Promise<void> {
    const cancelLink = `${env.FRONTEND_URL}/cancelStudentSchedule?token=${props.token}`;
    const rescheduleLink = `${env.FRONTEND_URL}/rescheduleStudentSchedule?token=${props.token}`;

    const mailOptions = {
      to,
      subject: "Agendamento Solicitado - SAP ICOMP",
      html: buildScheduleStudentTemplate(props, rescheduleLink, cancelLink),
    };

    await this.sendEmail(mailOptions);
  }

  async sendScheduleRequestedPedagogueEmail(to: string, props: PedagogueScheduleEmailData): Promise<void> {
    const dashboardLink = `${env.FRONTEND_URL}/pedagogue/scheduling`;
    const mailOptions = {
      to,
      subject: "Nova solicitação de agendamento - SAP ICOMP",
      html: buildSchedulePedagogueTemplate(props, dashboardLink),
    };

    await this.sendEmail(mailOptions);
  }

  async sendScheduleConfirmedStudentEmail(to: string, props: ScheduleConfirmedStudentEmailData): Promise<void> {
    const mailOptions = {
      to,
      subject: "Agendamento Confirmado - SAP ICOMP",
      html: buildScheduleConfirmedStudentTemplate(props),
    };

    await this.sendEmail(mailOptions);
  }

  async sendScheduleCancelledStudentEmail(to: string, props: CancelledStudentEmailData): Promise<void> {
    const mailOptions = {
      to,
      subject: "Agendamento Cancelado - SAP ICOMP",
      html: buildCancelledScheduleStudentTemplate(props),
    };

    await this.sendEmail(mailOptions);
  }

  async sendScheduleCancelledPedagogueEmail(to: string, props: CancelledPedagogueEmailData): Promise<void> {
    const mailOptions = {
      to,
      subject: "Agendamento Cancelado pelo Aluno - SAP ICOMP",
      html: buildCancelledPedagogueTemplate(props),
    };

    await this.sendEmail(mailOptions);
  }

  async sendRescheduledPedagogueEmail(to: string, props: RescheduledPedagogueEmailData): Promise<void> {
    const dashboardLink = `${env.FRONTEND_URL}/pedagogue/scheduling`;
    const mailOptions = {
      to,
      subject: "Agendamento Remarcado - SAP ICOMP",
      html: buildRescheduledPedagogueTemplate(props, dashboardLink),
    };

    await this.sendEmail(mailOptions);
  }

  async sendRescheduledStudentEmail(to: string, props: RescheduledStudentEmailData): Promise<void> {
    const cancelLink = `${env.FRONTEND_URL}/cancelStudentSchedule?token=${props.token}`;
    const rescheduleLink = `${env.FRONTEND_URL}/rescheduleStudentSchedule?token=${props.token}`;

    const mailOptions = {
      to,
      subject: "Agendamento Remarcado - SAP ICOMP",
      html: buildRescheduledStudentTemplate(props, cancelLink, rescheduleLink),
    };

    await this.sendEmail(mailOptions);
  }
}
