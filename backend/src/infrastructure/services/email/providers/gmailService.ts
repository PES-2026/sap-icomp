import path from "node:path";
import { fileURLToPath } from "node:url";

import nodemailer from "nodemailer";

import { IEmailService } from "@domain/services/emailService";
import { PedagogueScheduleEmailData } from "@domain/services/interfaces/pedagogueScheduleEmailData";
import { StudentScheduleEmailData } from "@domain/services/interfaces/studentScheduleEmailData";
import { env } from "@infrastructure/config/env";

import { buildPasswordResetTemplate } from "../templates/passwordResetTemplate";
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
    const mailOptions = {
      to,
      subject: "Agendamento Solicitado - SAP ICOMP",
      html: buildScheduleStudentTemplate(props),
    };

    await this.sendEmail(mailOptions);
  }

  async sendScheduleRequestedPedagogueEmail(to: string, props: PedagogueScheduleEmailData): Promise<void> {
    const mailOptions = {
      to,
      subject: "Nova solicitação de agendamento - SAP ICOMP",
      html: buildSchedulePedagogueTemplate(props),
    };

    await this.sendEmail(mailOptions);
  }
}
