import { ApplicationError } from "@application/errors/applicationError";
import { InvalidResetTokenError } from "@application/errors/user/invalidResetTokenError";
import { UserNotFoundToResetError } from "@application/errors/user/userNotFoundToResetError";
import { IPasswordResetRepository } from "@domain/repositories/passwordResetRepository";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IProfessorRepository } from "@domain/repositories/professorRepository";
import { IHashService } from "@domain/services/hashService";
import { Result } from "@domain/shared/result";

import { ResetPasswordDTO } from "../../dtos/user/resetPasswordDto";

export class ResetPassword {
  constructor(
    private readonly hashService: IHashService,
    private readonly professorRepository: IProfessorRepository,
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly passwordResetRepository: IPasswordResetRepository,
  ) {}

  async execute(input: ResetPasswordDTO): Promise<Result<void, ApplicationError>> {
    const resetRecord = await this.passwordResetRepository.findByToken(input.token);

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      return Result.fail<void>(new InvalidResetTokenError());
    }

    const hashedPassword = await this.hashService.hash(input.newPassword);

    // Perform the update based on which user type is associated
    if (resetRecord.professorId) {
      await this.professorRepository.updatePassword(resetRecord.professorId, hashedPassword);
    } else if (resetRecord.pedagogueId) {
      await this.pedagogueRepository.updatePassword(resetRecord.pedagogueId, hashedPassword);
    } else {
      return Result.fail<void>(new UserNotFoundToResetError());
    }

    // Mark the token as used
    await this.passwordResetRepository.markAsUsed(resetRecord.internalId);

    return Result.ok<void>();
  }
}
