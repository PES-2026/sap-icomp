import api from "@/services/api";
import {
  Diagnostic,
  DiagnosticsResponse,
  DiagnosticPayload,
} from "../types/diagnostic";

export const diagnosticService = {
  async getDiagnostics(page = 1, limit = 20): Promise<DiagnosticsResponse> {
    const response = await api.get<DiagnosticsResponse>("/diagnoses", {
      params: { page, limit },
      fallbackMsg: "Não foi possível carregar os diagnósticos.",
    });

    return response.data;
  },

  async createDiagnostic(data: DiagnosticPayload): Promise<Diagnostic> {
    const response = await api.post<Diagnostic>("/diagnoses", data, {
      fallbackMsg: "Não foi possível criar o diagnóstico.",
    });

    return response.data;
  },

  async updateDiagnostic(
    id: string,
    data: DiagnosticPayload,
  ): Promise<Diagnostic> {
    const response = await api.put<Diagnostic>(`/diagnoses/${id}`, data, {
      fallbackMsg: "Não foi possível atualizar o diagnóstico.",
    });

    return response.data;
  },
};
