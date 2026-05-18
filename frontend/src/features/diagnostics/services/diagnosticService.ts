import api from "@/services/api";
import {
  Diagnostic,
  DiagnosticPayload,
  DiagnosticsResponse,
} from "../types/diagnostic";

export const diagnosticService = {
  async getAllDiagnostics(page = 1, limit = 20): Promise<DiagnosticsResponse> {
    const response = await api.get<DiagnosticsResponse>("/diagnoses", {
      params: { page, limit },
      fallbackMsg: "Não foi possível carregar os diagnósticos.",
    });

    return response.data;
  },

  async getById(id: string): Promise<Diagnostic> {
    const response = await api.get<Diagnostic>(`/diagnoses/${id}`, {
      fallbackMsg: "Não foi possível carregar os detalhes do diagnóstico.",
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

  async removeDiagnostic(id: string): Promise<void> {
    await api.post(`/diagnoses/${id}/remove`, {
      fallbackMsg: "Não foi possível remover o diagnóstico.",
    });
  },
};
