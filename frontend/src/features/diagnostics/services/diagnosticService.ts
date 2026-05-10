import api from "@/services/api";
import { DiagnosticsFilters, DiagnosticsResponse } from "../types/diagnostic";

export const diagnosticService = {
  async getDiagnostic(
    filters: DiagnosticsFilters,
  ): Promise<DiagnosticsResponse> {
    const response = await api.get<DiagnosticsResponse>("/diagnoses", {
      params: filters,
      fallbackMsg: "Não foi possível carregar os diagnósticos.",
    });

    return response.data;
  },
};
