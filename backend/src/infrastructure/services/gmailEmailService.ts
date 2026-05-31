import nodemailer from "nodemailer";

import { IEmailService } from "../../domain/services/emailService";
import { env } from "../config/env";

export class GmailEmailService implements IEmailService {
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

  async sendPasswordResetEmail(to: string, name: string, token: string): Promise<void> {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: env.GMAIL_USER,
      to,
      subject: "Recuperação de Senha - SAP-ICOMP",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Olá, ${name}</h2>
          <p>Você solicitou a recuperação de sua senha no sistema SAP-ICOMP.</p>
          <p>Para criar uma nova senha, clique no botão abaixo:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Redefinir Senha</a>
          <p>Ou copie e cole o link abaixo no seu navegador:</p>
          <p>${resetUrl}</p>
          <p>Este link é válido por 1 hora.</p>
          <p>Se você não solicitou esta alteração, por favor ignore este e-mail.</p>
          <hr />
          <p style="font-size: 12px; color: #666;">Equipe SAP-ICOMP</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
