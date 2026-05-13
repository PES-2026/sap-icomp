"use client";

import CommonButton from "@/components/ui/CommonButton";
import { InfoBadge } from "@/components/ui/InfoBadge";
import { ManageSectionCard } from "@/components/ui/ManageSectionCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useDiagnostics } from "../hooks/useDiagnostics";
import { DiagnosticModal } from "./DiagnosticModal";

export default function DiagnosticSection() {
  // Deixar aqui apenas o get dos diagnósticos, filtros e a lógica de abrir o Modal
  const { diagnostics, fetchDiagnostics, isLoading } = useDiagnostics();

  const [nameFilter, setNameFilter] = useState("");
  const [acronymFilter, setAcronymFilter] = useState("");
  const [cidFilter, setCidFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Lógica de filtros no lugar certo
  const filteredDiagnostics = useMemo(() => {
    return diagnostics.filter((diagnostic) => {
      const nameMatch = diagnostic.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());

      const acronymMatch = (diagnostic.acronym ?? "")
        .toLowerCase()
        .includes(acronymFilter.toLowerCase());

      const cidMatch = (diagnostic.cid ?? "")
        .toLowerCase()
        .includes(cidFilter.toLowerCase());

      return nameMatch && acronymMatch && cidMatch;
    });
  }, [diagnostics, nameFilter, acronymFilter, cidFilter]);

  const handleOpenCreate = () => {
    setSelectedId(null);
    setIsModalOpen(true);
  };

  // Renomear handleOpenView
  const handleOpenView = (externalId: string) => {
    setSelectedId(externalId);
    setIsModalOpen(true);
  };

  return (
    <>
      <ManageSectionCard
        title="Gerenciar Diagnósticos"
        searchInputs={
          <>
            <SearchInput
              placeholder="Buscar por Diagnóstico"
              value={nameFilter}
              onChange={setNameFilter}
            />
            <SearchInput
              placeholder="Buscar por Sigla"
              value={acronymFilter}
              onChange={setAcronymFilter}
            />
            <SearchInput
              placeholder="Buscar por CID"
              value={cidFilter}
              onChange={setCidFilter}
            />
          </>
        }
        actionButton={
          <CommonButton
            label="Adicionar Diagnóstico"
            endIcon={Plus}
            onClick={handleOpenCreate}
            className="min-w-70 justify-center"
          />
        }
      >
        {isLoading ? (
          <span className="text-sm text-stone-500">
            Carregando diagnósticos...
          </span>
        ) : filteredDiagnostics.length === 0 ? (
          <span className="text-sm text-stone-500">
            Nenhum diagnóstico encontrado.
          </span>
        ) : (
          filteredDiagnostics.map((diagnostic) => (
            <InfoBadge
              key={diagnostic.externalId}
              label={[
                diagnostic.name,
                diagnostic.acronym ? `(${diagnostic.acronym})` : "",
                diagnostic.cid ? `- ${diagnostic.cid}` : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => handleOpenView(diagnostic.externalId)} // handleOpenView(diagnose.externalId)
            />
          ))
        )}
      </ManageSectionCard>

      {isModalOpen && (
        <DiagnosticModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          diagnosticId={selectedId}
          onSuccess={fetchDiagnostics}
        />
      )}
    </>
  );
}
