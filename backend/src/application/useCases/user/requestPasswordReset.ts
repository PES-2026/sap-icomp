import crypto from "node:crypto";

import { ApplicationError } from "@application/errors/applicationError";
import { RoleEnum } from "@domain/enum/role";
import { IPasswordResetRepository } from "@domain/repositories/passwordResetRepository";
import { IEmailService } from "@domain/services/emailService";
import { Result } from "@domain/shared/result";

import { ForgotPasswordDTO } from "../../dtos/user/forgotPasswordDto";

import { UserResolver } from "./userResolver";

export class RequestPasswordReset {
  constructor(
    private readonly userResolver: UserResolver,
    private readonly emailService: IEmailService,
    private readonly passwordResetRepository: IPasswordResetRepository,
  ) {}

  async execute(input: ForgotPasswordDTO): Promise<Result<void, ApplicationError>> {
    const resolvedData = await this.userResolver.execute(input.email);

    if (resolvedData.isFailure) {
      // Security: Don't reveal that the user doesn't exist
      return Result.ok<void>();
    }

    const { userData, role } = resolvedData.getValue();

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour validity

    // Create the reset record associated with the user via repository
    await this.passwordResetRepository.create({
      token,
      expiresAt,
      professorId: role === RoleEnum.PROFESSOR ? userData.id : undefined,
      pedagogueId: role === RoleEnum.PEDAGOGUE ? userData.id : undefined,
    });

    // Send the email
    try {
      await this.emailService.sendPasswordResetEmail(userData.email, userData.name, token);
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      // We still return OK to the user to avoid enumeration, but log the error
    }

    return Result.ok<void>();
  }
}
