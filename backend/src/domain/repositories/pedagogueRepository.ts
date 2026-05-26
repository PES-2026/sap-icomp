import { Pedagogue } from "../entities/pedagogue";
import { PaginatedResult } from "../shared/pagination";

import { UserFilters } from "./filters/userFilters";
import { UserListItem } from "./results/userResult";

//import {PedagogueListParams} from "./filters/pedagogueFilters";
//import {PaginatedPedagogueResult, PedagogueResult} from "./results/pedagogueResult";

export interface IPedagogueRepository {
  findAll(filters: UserFilters, page: number, limit: number): Promise<PaginatedResult<UserListItem>>;
  save(pedagogue: Pedagogue): Promise<void>;
  //update(pedagogue: Pedagogue): Promise<void>;
  //existsByUUID(externalId: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  existsByRegistrationNumber(registrationNumber: string): Promise<boolean>;
  //findByUUID(externalId: string): Promise<PedagogueResult | null>;
  //disableByUUID(externalId: string): Promise<boolean>;
  findByEmail(email: string): Promise<Pedagogue | null>;
}
