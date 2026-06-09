import { Professor } from "../entities/professor";
import { PaginatedResult } from "../shared/pagination";

import { UserFilters } from "./filters/userFilters";
import { UserAuthResult } from "./results/userAuthResult";
import { UserResult } from "./results/userResult";

export interface IProfessorRepository {
  findAll(filters: UserFilters, page: number, limit: number): Promise<PaginatedResult<UserResult>>;
  save(professor: Professor): Promise<void>;
  update(professor: Professor): Promise<void>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
  findById(id: string): Promise<UserResult | null>;
  findByEmail(email: string): Promise<UserResult | null>;
  findByEmailWithPassword(email: string): Promise<UserAuthResult | null>;
  existsByEmail(email: string): Promise<boolean>;
  existsByRegistrationNumber(registrationNumber: string): Promise<boolean>;
  remove(id: string): Promise<void>;
}
