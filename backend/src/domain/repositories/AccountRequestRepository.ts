import { AccountRequest } from "@domain/entities/accountRequest";

export interface IAccountRequestRepository {
  save(accountRequest: AccountRequest): Promise<void>;
  findById(id: string): Promise<AccountRequest | null>;
  update(accountRequest: AccountRequest): Promise<void>;
  findAllPending(): Promise<AccountRequest[]>;
  //findByEmail(email: string): Promise<AccountRequest | null>;
  //deleteById(id: string): Promise<void>;
}
