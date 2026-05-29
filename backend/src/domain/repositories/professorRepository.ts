import { Professor } from "../entities/professor";
import { PaginatedResult } from "../shared/pagination";

import { UserFilters } from "./filters/userFilters";
import { UserItem } from "./results/userResult";

//import {PedagogueListParams} from "./filters/pedagogueFilters";
//import {PaginatedPedagogueResult, PedagogueResult} from "./results/pedagogueResult";

import { UserAuthResult } from "./results/userAuthResult";

export interface IProfessorRepository {
  findAll(filters: UserFilters, page: number, limit: number): Promise<PaginatedResult<UserItem>>;
  save(professor: Professor): Promise<void>;
  update(professor: Professor): Promise<void>;
  findById(id: string): Promise<UserItem | null>;
  findByEmail(email: string): Promise<UserItem | null>;
  //existsByUUID(externalId: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  existsByRegistrationNumber(registrationNumber: string): Promise<boolean>;
  remove(id: string): Promise<void>;
}
