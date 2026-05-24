import { Professor } from "../entities/professor";

//import {PedagogueListParams} from "./filters/pedagogueFilters";
//import {PaginatedPedagogueResult, PedagogueResult} from "./results/pedagogueResult";

import { UserFilters } from "./filters/userFilters";
import { UserListItem } from "./results/userResult";
import { PaginatedResult } from "../shared/pagination";

export interface IProfessorRepository {
  findAll(filters: UserFilters, page: number, limit: number): Promise<PaginatedResult<UserListItem>>;
  save(professor: Professor): Promise<void>;
  //update(professor: Professor): Promise<void>;
  //existsByUUID(externalId: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  existsByRegistrationNumber(registrationNumber: string): Promise<boolean>;
  //findByUUID(externalId: string): Promise<ProfessorResult | null>;
  //disableByUUID(externalId: string): Promise<boolean>;
}
