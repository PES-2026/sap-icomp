import { BaseItem } from "@domain/shared/item";
import { PaginatedResult } from "@domain/shared/pagination";

export interface DiagnosisResult extends BaseItem {
  name: string;
  acronym: string;
  cid: string;
}

export type PaginatedDiagnosisResult = PaginatedResult<DiagnosisResult>;
