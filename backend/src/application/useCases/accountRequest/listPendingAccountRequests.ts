import { Result } from "@domain/shared/result";
import { IAccountRequestRepository } from "@domain/repositories/AccountRequestRepository";

export type ListPendingAccountRequestsResponse = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  registrationNumber: string;
  userType?: string | undefined;
  userStatus: string;
  createdAt?: Date | undefined;
}[];

export class ListPendingAccountRequests {
  constructor(private readonly repository: IAccountRequestRepository) {}

  async execute(): Promise<Result<ListPendingAccountRequestsResponse>> {
    const pendingRequests = await this.repository.findAllPending();

    const response: ListPendingAccountRequestsResponse = pendingRequests.map((request) => ({
      id: request.id.value,
      name: request.name.value,
      email: request.email.value,
      phoneNumber: request.phoneNumber.value,
      registrationNumber: request.registrationNumber.value,
      userType: request.userType?.value,
      userStatus: request.userStatus.value,
    }));

    return Result.ok(response);
  }
}
