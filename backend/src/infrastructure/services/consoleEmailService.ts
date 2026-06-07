import { EmailOptions, IEmailService } from "@domain/services/emailService";

export class ConsoleEmailService implements IEmailService {
  async sendEmail(options: EmailOptions): Promise<void> {
    console.log(`Sending email to ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body: ${options.body}`);
  }
}
