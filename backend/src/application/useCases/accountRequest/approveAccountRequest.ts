import { ApproveUserDTO } from "@application/dtos/accountRequest/approveUserDto";
import { AccountRequestNotFoundError } from "@application/errors/accountRequest/accountRequestNotFound";
import { InvalidRoleError } from "@application/errors/accountRequest/invalidRole";
import { RoleRequiredForApprovalError } from "@application/errors/accountRequest/roleRequiredForApproval";
import { Pedagogue } from "@domain/entities/pedagogue";
import { Professor } from "@domain/entities/professor";
import { RoleEnum } from "@domain/enum/role";
import { UserStatusEnum } from "@domain/enum/userStatus";
import { IAccountRequestRepository } from "@domain/repositories/accountRequestRepository";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IProfessorRepository } from "@domain/repositories/professorRepository";
import { Result } from "@domain/shared/result";

export type ApproveAccountRequestResponse = {
  message: string;
  user?: unknown;
};

export class ApproveAccountRequest {
  constructor(
    private readonly repository: IAccountRequestRepository,
    private readonly pedagogueRepository: IPedagogueRepository,
    private readonly professorRepository: IProfessorRepository,
  ) {}

  async execute(props: ApproveUserDTO): Promise<Result<ApproveAccountRequestResponse>> {
    const accountRequest = await this.repository.findById(props.id);

    if (!accountRequest) {
      return Result.fail(new AccountRequestNotFoundError(props.id));
    }

    if (!props.isApproved) {
      accountRequest.reject();
      await this.repository.update(accountRequest);
      return Result.ok({ message: "Account request rejected successfully" });
    }

    // Approval flow
    if (!props.role) {
      return Result.fail(new RoleRequiredForApprovalError());
    }

    accountRequest.approve();
    await this.repository.update(accountRequest);

    let createdUser: unknown;

    if (props.role === RoleEnum.PEDAGOGUE) {
      const pedagogueOrError = Pedagogue.create({
        name: accountRequest.name.value,
        email: accountRequest.email.value,
        phoneNumber: accountRequest.phoneNumber.value,
        registrationNumber: accountRequest.registrationNumber.value,
        password: accountRequest.password.value,
        userStatus: UserStatusEnum.ENABLED, // ACTIVE as requested (ENABLED is our nearest equivalent)
      });

      if (pedagogueOrError.isFailure) {
        return Result.fail(pedagogueOrError.error!);
      }

      createdUser = pedagogueOrError.getValue();
      await this.pedagogueRepository.save(createdUser);
    } else if (props.role === RoleEnum.PROFESSOR) {
      const professorOrError = Professor.create({
        name: accountRequest.name.value,
        email: accountRequest.email.value,
        phoneNumber: accountRequest.phoneNumber.value,
        registrationNumber: accountRequest.registrationNumber.value,
        password: accountRequest.password.value,
        userStatus: UserStatusEnum.ENABLED,
      });

      if (professorOrError.isFailure) {
        return Result.fail(professorOrError.error!);
      }

      createdUser = professorOrError.getValue();
      await this.professorRepository.save(createdUser);
    } else {
      return Result.fail(new InvalidRoleError(props.role));
    }

    return Result.ok({
      message: "Account request approved and user created successfully",
      user: {
        id: createdUser.id.value,
        name: createdUser.name.value,
        email: createdUser.email.value,
        userStatus: createdUser.userStatus.value,
      },
    });
  }
}
