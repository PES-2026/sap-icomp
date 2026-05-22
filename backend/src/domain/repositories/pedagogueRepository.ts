import { Pedagogue } from "../entities/pedagogue";

//import {PedagogueListParams} from "./filters/pedagogueFilters";
//import {PaginatedPedagogueResult, PedagogueResult} from "./results/pedagogueResult";

export interface IPedagogueRepository {
  //findAll(params: PedagogueListParams): Promise<PaginatedPedagogueResult>;
  //existsByEmail(email: string): Promise<boolean>;
  save(pedagogue: Pedagogue): Promise<void>;
  //update(pedagogue: Pedagogue): Promise<void>;
  //existsByUUID(externalId: string): Promise<boolean>;
  //findByUUID(externalId: string): Promise<PedagogueResult | null>;
  //disableByUUID(externalId: string): Promise<boolean>;
}
