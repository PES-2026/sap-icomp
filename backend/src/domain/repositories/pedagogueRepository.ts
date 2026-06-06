import { Pedagogue } from "../entities/pedagogue";
import { PaginatedResult } from "../shared/pagination";

import { UserFilters } from "./filters/userFilters";
import { UserAuthResult } from "./results/userAuthResult";
import { UserItem } from "./results/userResult";

//import {PedagogueListParams} from "./filters/pedagogueFilters";
//import {PaginatedPedagogueResult, PedagogueResult} from "./results/pedagogueResult";

export interface IPedagogueRepository {
  findAll(filters: UserFilters, page: number, limit: number): Promise<PaginatedResult<UserItem>>;
  save(pedagogue: Pedagogue): Promise<void>;
  update(pedagogue: Pedagogue): Promise<void>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
  findById(id: string): Promise<UserItem | null>;
  findByEmail(email: string): Promise<UserItem | null>;
  findByEmailWithPassword(email: string): Promise<UserAuthResult | null>;
  //existsByUUID(externalId: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  existsByRegistrationNumber(registrationNumber: string): Promise<boolean>;
  remove(id: string): Promise<void>;
}
