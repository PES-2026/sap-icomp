import { ApplicationError } from "@application/errors/applicationError";
import { RoleEnum } from "@domain/enum/role";
import { Result } from "@domain/shared/result";

import { UserResolver } from "./userResolver";

export interface AuthenticatedUserResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    registrationNumber: string;
    role: RoleEnum;
    userStatus: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export class GetAuthenticatedUser {
  constructor(private readonly userResolver: UserResolver) {}

  async execute(email: string): Promise<Result<AuthenticatedUserResponse, ApplicationError>> {
    const result = await this.userResolver.execute(email);

    if (result.isFailure) {
      return Result.fail<AuthenticatedUserResponse>(result.error!);
    }

    const { userData, role } = result.getValue();
    const { password: _, ...userWithoutPassword } = userData;

    return Result.ok<AuthenticatedUserResponse>({
      user: {
        ...userWithoutPassword,
        role,
      },
    });
  }
}
