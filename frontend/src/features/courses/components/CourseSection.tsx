"use client";

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import CommonButton from "@/components/ui/CommonButton";
import { InfoBadge } from "@/components/ui/InfoBadge";
import { ManageSectionCard } from "@/components/ui/ManageSectionCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useCoursesSettings } from "../hooks/useCoursesSettings";
import { Course } from "../types/course";
import { CourseModal } from "./CourseModal";

export default function CourseSection() {
  const { courses, fetchCourses, isLoading, removeCourse } =
    useCoursesSettings();

  const [searchFilter, setSearchFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourseToDelete, setSelectedCourseToDelete] =
    useState<Course | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      fetchCourses(searchFilter);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchFilter]);

  const handleOpenCreate = () => {
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const handleOpenView = (externalId: string) => {
    setSelectedId(externalId);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (course: Course) => {
    setSelectedCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setSelectedCourseToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCourseToDelete) return;

    const success = await removeCourse(selectedCourseToDelete.externalId);

    if (success) {
      handleCancelDelete();
    }
  };

  const isSearching = searchFilter.trim().length > 0;

  return (
    <>
      <ManageSectionCard
        title="Gerenciar Cursos"
        searchInputs={
          <SearchInput
            placeholder="Buscar por Cursos"
            value={searchFilter}
            onChange={setSearchFilter}
          />
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
          courses.map((course) => (
            <div key={course.externalId} className="flex items-center gap-1">
              <InfoBadge
                label={`${course.name} (${course.acronym})`}
                onClick={() => handleOpenView(course.externalId)}
              />

              <button
                type="button"
                title="Excluir curso"
                onClick={() => handleOpenDeleteModal(course)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-red-400 transition-colors hover:bg-red-100 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </ManageSectionCard>

      {isModalOpen && (
        <CourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          courseId={selectedId}
          onSuccess={() => fetchCourses(searchFilter)}
          courses={courses}
        />
      )}

      <ConfirmModal
        open={isDeleteModalOpen}
        title="Excluir Curso"
        message={`Tem certeza que deseja excluir o curso ${selectedCourseToDelete?.name}? Esta ação removerá o curso permanentemente do catálogo.`}
        confirmLabel="Excluir"
        confirmColor="critical"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
