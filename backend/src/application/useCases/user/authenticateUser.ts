import { ApplicationError } from "@application/errors/applicationError";
import { InvalidCredentialsError } from "@application/errors/user/invalidCredentialsError";
import { AuthResult } from "@domain/repositories/results/authResult";
import { Result } from "@domain/shared/result";
import { AuthenticateUserRequestDTO } from "../../dtos/user/authenticateUserDto";

import { IHashService } from "@domain/services/hashService";
import { ITokenService } from "@domain/services/tokenService";
import { UserResolver } from "./userResolver";

export class AuthenticateUser {
  constructor(
    private readonly userResolver: UserResolver,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: AuthenticateUserRequestDTO): Promise<Result<AuthResult, ApplicationError>> {
    const resolvedData = await this.userResolver.execute(input.email);

    if (!resolvedData) {
      return Result.fail<AuthResult>(new InvalidCredentialsError());
    }

    const { userEntity, role } = resolvedData;

    const isPasswordValid = await this.hashService.compare(input.password, userEntity.password.value);

    if (!isPasswordValid) {
      return Result.fail<AuthResult>(new InvalidCredentialsError());
    }

    const token = this.tokenService.generateToken({ id: userEntity.id.value, role: role }, "1d");

    const authResult = new AuthResult(
      userEntity.id.value,
      userEntity.name.value,
      userEntity.email.value,
      userEntity.phoneNumber?.value || "",
      userEntity.registrationNumber.value,
      role,
      userEntity.userStatus.value,
      userEntity.createdAt,
      userEntity.updatedAt,
      token,
    );

    return Result.ok<AuthResult>(authResult);
  }
}
