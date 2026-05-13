export interface Diagnostic {
  externalId: string;
  name: string;
  acronym: string;
  cid: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosticPayload {
  name?: string;
  acronym?: string;
  cid?: string;
}

export interface DiagnosticsResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: Diagnostic[];
}
