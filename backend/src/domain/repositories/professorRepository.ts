import { Professor } from "../entities/professor";
import { PaginatedResult } from "../shared/pagination";

import { UserFilters } from "./filters/userFilters";
import { UserListItem } from "./results/userResult";

//import {PedagogueListParams} from "./filters/pedagogueFilters";
//import {PaginatedPedagogueResult, PedagogueResult} from "./results/pedagogueResult";

export interface IProfessorRepository {
  findAll(filters: UserFilters, page: number, limit: number): Promise<PaginatedResult<UserListItem>>;
  save(professor: Professor): Promise<void>;
  update(professor: Professor): Promise<void>;
  findById(id: string): Promise<Professor | null>;
  findByEmail(email: string): Promise<Professor | null>;
  //existsByUUID(externalId: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  existsByRegistrationNumber(registrationNumber: string): Promise<boolean>;
  //findByUUID(externalId: string): Promise<ProfessorResult | null>;
  //disableByUUID(externalId: string): Promise<boolean>;
}
