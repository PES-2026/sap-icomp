import { AccountRequest } from "@domain/entities/accountRequest";

export interface IAccountRequestRepository {
  save(accountRequest: AccountRequest): Promise<void>;
  //findByEmail(email: string): Promise<AccountRequest | null>;
  //findById(id: string): Promise<AccountRequest | null>;
  //deleteById(id: string): Promise<void>;
}
