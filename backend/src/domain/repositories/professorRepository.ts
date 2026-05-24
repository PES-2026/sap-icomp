import { Professor } from "../entities/professor";

//import {PedagogueListParams} from "./filters/pedagogueFilters";
//import {PaginatedPedagogueResult, PedagogueResult} from "./results/pedagogueResult";

export interface IProfessorRepository {
  //findAll(params: ProfessorListParams): Promise<PaginatedProfessorResult>;
  //existsByEmail(email: string): Promise<boolean>;
  save(professor: Professor): Promise<void>;
  //update(professor: Professor): Promise<void>;
  //existsByUUID(externalId: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  existsByRegistrationNumber(registrationNumber: string): Promise<boolean>;
  //findByUUID(externalId: string): Promise<ProfessorResult | null>;
  //disableByUUID(externalId: string): Promise<boolean>;
}
