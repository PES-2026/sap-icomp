export interface Diagnostic {
  externalId: string;
  name: string;
  acronym: string;
  CID: string;
  createdAt: string;
  updatedAt: string;

  // critério pede esses dois campos
  isDefault?: boolean;
  studentsCount?: number;
}

export interface DiagnosticsResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: Diagnostic[];
}

export interface DiagnosticsFilters {
  page: number;
  limit: number;
  name?: string;
  acronym?: string;
  CID?: string;
}
