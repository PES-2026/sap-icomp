import { Diagnosis } from "@domain/entities/diagnosis";

import { DiagnosisListParams } from "./filters/diagnosisFilters";
import { DiagnosisResult, PaginatedDiagnosisResult } from "./results/diagnosisResult";

export interface IDiagnosesRepository {
  save(diagnosis: Diagnosis): Promise<void>;
  findById(id: string): Promise<DiagnosisResult | null>;
  findByName(name: string): Promise<DiagnosisResult | null>;
  findByAcronym(acronym: string): Promise<DiagnosisResult | null>;
  findByCid(cid: string): Promise<DiagnosisResult | null>;
  findAll(params: DiagnosisListParams): Promise<PaginatedDiagnosisResult>;
  update(diagnosis: Diagnosis): Promise<void>;
}
