"use client";

import CommonButton from "@/components/ui/CommonButton";
import { InfoBadge } from "@/components/ui/InfoBadge";
import { ManageSectionCard } from "@/components/ui/ManageSectionCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useDiagnostics } from "../hooks/useDiagnostics";
import { Diagnostic } from "../types/diagnostic";
import { DiagnosticModal } from "./DiagnosticModal";

export default function DiagnosticSection() {
  const [nameFilter, setNameFilter] = useState("");
  const [acronymFilter, setAcronymFilter] = useState("");
  const [cidFilter, setCidFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] =
    useState<Diagnostic | null>(null);
  const { diagnostics, isLoading, createDiagnostic, updateDiagnostic } =
    useDiagnostics();

  const filteredDiagnostics = useMemo(() => {
    return diagnostics.filter((diagnostic) => {
      const nameMatch = diagnostic.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());

      const acronymMatch = (diagnostic.acronym ?? "")
        .toLowerCase()
        .includes(acronymFilter.toLowerCase());

      const cidMatch = (diagnostic.CID ?? "")
        .toLowerCase()
        .includes(cidFilter.toLowerCase());

      return nameMatch && acronymMatch && cidMatch;
    });
  }, [diagnostics, nameFilter, acronymFilter, cidFilter]);

  const handleOpenCreate = () => {
    setSelectedDiagnostic(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (diagnostic: Diagnostic) => {
    setSelectedDiagnostic(diagnostic);
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
                diagnostic.CID ? `- ${diagnostic.CID}` : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => handleOpenEdit(diagnostic)}
            />
          ))
        )}
      </ManageSectionCard>

      {isModalOpen && (
        <DiagnosticModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          diagnostic={selectedDiagnostic}
          diagnostics={diagnostics}
          onCreate={createDiagnostic}
          onUpdate={updateDiagnostic}
        />
      )}
    </>
  );
}
