import { PaginationParams } from "@domain/shared/pagination";

export interface ListDiagnosisFilters {
  name?: string;
  acronym?: string;
  cid?: string;
}

export type DiagnosisListParams = PaginationParams<"filters", ListDiagnosisFilters>;
