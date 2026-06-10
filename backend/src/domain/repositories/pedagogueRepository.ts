import { Pedagogue } from "../entities/pedagogue";
import { PaginatedResult } from "../shared/pagination";

import { UserFilters } from "./filters/userFilters";
import { UserAuthResult } from "./results/userAuthResult";
import { UserResult } from "./results/userResult";

export interface IPedagogueRepository {
  findAll(filters: UserFilters, page: number, limit: number): Promise<PaginatedResult<UserResult>>;
  save(pedagogue: Pedagogue): Promise<void>;
  update(pedagogue: Pedagogue): Promise<void>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
  findById(id: string): Promise<UserResult | null>;
  findByIdWithPassword(id: string): Promise<UserAuthResult | null>;
  findByEmail(email: string): Promise<UserResult | null>;
  findByEmailWithPassword(email: string): Promise<UserAuthResult | null>;
  existsByEmail(email: string): Promise<boolean>;
  existsByRegistrationNumber(registrationNumber: string): Promise<boolean>;
  remove(id: string): Promise<void>;
}
