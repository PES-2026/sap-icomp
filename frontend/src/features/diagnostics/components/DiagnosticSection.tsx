"use client";

import CommonButton from "@/components/ui/CommonButton";
import { ManageSectionCard } from "@/components/ui/ManageSectionCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDiagnostics } from "../hooks/useDiagnostics";

export default function DiagnosticSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const { diagnostics, isLoading } = useDiagnostics(searchTerm);

  return (
    <ManageSectionCard
      title="Catálogo de Diagnósticos"
      searchInputs={
        <SearchInput
          placeholder="Buscar diagnóstico"
          value={searchTerm}
          onChange={setSearchTerm}
        />
      }
      actionButton={null}
    >
      {isLoading ? (
        <span className="text-sm text-stone-500">
          Carregando diagnósticos...
        </span>
      ) : diagnostics.length === 0 ? (
        <span className="text-sm text-stone-500">
          Nenhum diagnóstico encontrado.
        </span>
      ) : (
        <div className="w-full overflow-x-auto">
          {
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#e2ddd5] text-left text-stone-600">
                  <th className="py-2 pr-4">Diagnóstico</th>
                  <th className="py-2 pr-4">Sigla</th>
                  <th className="py-2 pr-4">CID</th>
                  <th className="py-2 pr-4">Origem</th>
                  <th className="py-2 pr-4">Uso</th>
                  <th className="py-2 text-right">Ações</th>
                </tr>
              </thead>

              <tbody>
                {diagnostics.map((diagnostic) => (
                  <tr
                    key={diagnostic.externalId}
                    className="border-b border-[#ece7db]"
                  >
                    <td className="py-3 pr-4 font-medium text-stone-800">
                      {diagnostic.name}
                    </td>

                    <td className="py-3 pr-4 text-stone-600">
                      {diagnostic.acronym || "-"}
                    </td>

                    <td className="py-3 pr-4 text-stone-600">
                      {diagnostic.CID || "-"}
                    </td>

                    <td className="py-3 pr-4">
                      <span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-medium text-stone-700">
                        {diagnostic.isDefault ? "Padrão" : "Customizado"}
                      </span>
                    </td>

                    <td className="py-3 pr-4 text-stone-600">
                      {diagnostic.studentsCount ?? 0} alunos
                    </td>

                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <CommonButton
                          label="Editar"
                          startIcon={Edit}
                          onClick={() => {}}
                        />
                        <CommonButton
                          label="Excluir"
                          startIcon={Trash2}
                          onClick={() => {}}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </div>
      )}
    </ManageSectionCard>
  );
}
