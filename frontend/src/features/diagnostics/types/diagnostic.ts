export interface Diagnostic {
  externalId: string;
  name: string;
  acronym: string;
  CID: string; // cid
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosticPayload {
  name: string;
  acronym?: string;
  CID?: string; // cid
}

export interface DiagnosticsResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: Diagnostic[];
}
