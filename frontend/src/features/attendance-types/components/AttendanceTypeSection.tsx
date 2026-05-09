"use client";

import CommonButton from "@/components/ui/CommonButton";
import { InfoBadge } from "@/components/ui/InfoBadge";
import { ManageSectionCard } from "@/components/ui/ManageSectionCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { Loader2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useAttendanceTypes } from "../hooks/useAttendanceTypes";
import { AttendanceTypeModal } from "./AttendanceTypeModal";

export default function AttendanceTypeSection() {
  const { attendanceTypes, fetchTypes, isLoading } = useAttendanceTypes();

  const [searchFilter, setSearchFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredTypes = useMemo(() => {
    return attendanceTypes.filter((item) =>
      item.name.toLowerCase().includes(searchFilter.toLowerCase()),
    );
  }, [attendanceTypes, searchFilter]);

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
      title="Gerenciar Tipos de Atendimento"
      searchInputs={
        <SearchInput
          placeholder="Buscar por Tipo de Atendimento"
          value={searchFilter}
          onChange={setSearchFilter}
        />
      }
      actionButton={
        <CommonButton
          label="Adicionar Tipo de Atendimento"
          endIcon={Plus}
          onClick={handleOpenCreate}
        />
      }
    >
      <Loader2 size={40} />
    </ManageSectionCard>;
  }

  return (
    <>
      <ManageSectionCard
        title="Gerenciar Tipos de Atendimento"
        searchInputs={
          <SearchInput
            placeholder="Buscar por Tipo de Atendimento"
            value={searchFilter}
            onChange={setSearchFilter}
          />
        }
        actionButton={
          <CommonButton
            label="Adicionar Tipo de Atendimento"
            endIcon={Plus}
            onClick={handleOpenCreate}
          />
        }
      >
        {isLoading ? (
          <span className="text-sm text-stone-500 font-medium">
            Carregando tipos de atendimento...
          </span>
        ) : filteredTypes.length === 0 ? (
          <span className="text-sm text-stone-500">
            Nenhum tipo de atendimento encontrado.
          </span>
        ) : (
          filteredTypes.map((type) => (
            <InfoBadge
              key={type.externalId}
              label={type.name}
              onClick={() => handleOpenView(type.externalId)}
            />
          ))
        )}
      </ManageSectionCard>

      <AttendanceTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        attendanceTypeId={selectedId}
        onSuccess={fetchTypes}
      />
    </>
  );
}
