"use client";

import CommonButton from "@/components/ui/CommonButton";
import { InfoBadge } from "@/components/ui/InfoBadge";
import { ManageSectionCard } from "@/components/ui/ManageSectionCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useDiagnostics } from "../hooks/useDiagnostics";
import { DiagnosticModal } from "./DiagnosticModal";

export default function DiagnosticSection() {
  const { diagnostics, fetchDiagnostics, isLoading } = useDiagnostics();

  const [nameFilter, setNameFilter] = useState("");
  const [acronymFilter, setAcronymFilter] = useState("");
  const [cidFilter, setCidFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredDiagnostics = diagnostics.filter((diagnostic) => {
    const nameMatch = (diagnostic.name || "")
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

  const handleOpenCreate = () => {
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const handleOpenView = (externalId: string) => {
    setSelectedId(externalId);
    setIsModalOpen(true);
  };

  if (isLoading) {
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
      <Loader2 size={40} />
    </ManageSectionCard>;
  }

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
            <div key={diagnostic.id} className="flex items-center gap-1">
              <InfoBadge
                label={[
                  diagnostic.name,
                  diagnostic.acronym ? `(${diagnostic.acronym})` : "",
                  diagnostic.cid ? `- ${diagnostic.cid}` : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handleOpenView(diagnostic.id)}
              />
            </div>
          ))
        )}
      </ManageSectionCard>

      <DiagnosticModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        diagnosticId={selectedId}
        onSuccess={fetchDiagnostics}
      />
    </>
  );
}
