"use client";

import CommonButton from "@/components/ui/CommonButton";
import { InfoBadge } from "@/components/ui/InfoBadge";
import { ManageSectionCard } from "@/components/ui/ManageSectionCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useCoursesSettings } from "../hooks/useCoursesSettings";
import { CourseModal } from "./CourseModal";

export default function CourseSection() {
  const { courses, fetchCourses, isLoading } = useCoursesSettings();

  const [nameFilter, setNameFilter] = useState("");
  const [acronymFilter, setAcronymFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredCourses = courses.filter((course) => {
    const nameMatch = (course.name || "")
      .toLowerCase()
      .includes(nameFilter.toLowerCase());

    const acronymMatch = (course.acronym ?? "")
      .toLowerCase()
      .includes(acronymFilter.toLowerCase());

    return nameMatch && acronymMatch;
  });

  const handleOpenCreate = () => {
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const handleOpenView = (externalId: string) => {
    setSelectedId(externalId);
    setIsModalOpen(true);
  };

  const isSearching = nameFilter.trim().length > 0;

  return (
    <>
      <ManageSectionCard
        title="Gerenciar Cursos"
        searchInputs={
          <>
            <SearchInput
              placeholder="Buscar por nome do curso"
              value={nameFilter}
              onChange={setNameFilter}
            />
            <SearchInput
              placeholder="Buscar por sigla do curso"
              value={acronymFilter}
              onChange={setAcronymFilter}
            />
          </>
        }
        actionButton={
          <CommonButton
            label="Adicionar Novo Curso"
            endIcon={Plus}
            onClick={handleOpenCreate}
            className="min-w-70 justify-center"
          />
        }
      >
        {isLoading ? (
          <span className="text-sm text-stone-500">Carregando cursos...</span>
        ) : courses.length === 0 && !isSearching ? (
          <span className="text-sm text-stone-500">
            Nenhum curso cadastrado ainda.
          </span>
        ) : courses.length === 0 ? (
          <span className="text-sm text-stone-500">
            Nenhum curso encontrado.
          </span>
        ) : (
          filteredCourses.map((course, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <InfoBadge
                label={`${course.name} (${course.acronym})`}
                onClick={() => handleOpenView(course.id)}
              />
            </div>
          ))
        )}
      </ManageSectionCard>

      {isModalOpen && (
        <CourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchCourses}
          courseId={selectedId}
        />
      )}
    </>
  );
}
