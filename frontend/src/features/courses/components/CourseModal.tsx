"use client";

import CommonButton from "@/components/ui/CommonButton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Field } from "@/components/ui/Field";
import { FormModal } from "@/components/ui/FormModal";
import { formatDate } from "@/utils/utils";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useCoursesSettings } from "../hooks/useCoursesSettings";
import { Course } from "../types/course";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string | null;
  onSuccess: () => void;
}

const inputClass =
  "w-full px-3.5 py-2.5 border-[1.5px] rounded-md bg-white text-sm text-stone-800 outline-none transition-colors font-sans border-stone-300 hover:border-stone-400 focus:border-teal-400 disabled:text-stone-500 disabled:cursor-not-allowed";

export function CourseModal({
  isOpen,
  onClose,
  courseId,
  onSuccess,
}: CourseModalProps) {
  const { getCourseById, createCourse, updateCourse, removeCourse } =
    useCoursesSettings(false);

  const [mode, setMode] = useState<"create" | "view" | "edit">("create");

  const [name, setName] = useState("");
  const [acronym, setAcronym] = useState("");
  const [coordinatorId, setCoordinatorId] = useState("");
  const [nameError, setNameError] = useState("");
  const [acronymError, setAcronymError] = useState("");
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (courseId) {
        setMode("view");
        getCourseById(courseId).then((data) => {
          if (data) {
            setName(data.name);
            setAcronym(data.acronym);
            setCoordinatorId(data.coordinatorId ?? "");
            setCourseData(data);
          }
        });
      } else {
        setMode("create");
        setName("");
        setAcronym("");
        setCoordinatorId("");
        setCourseData(null);
      }
    }
  }, [isOpen, courseId]);

  const handleSecondaryAction = () => {
    if (mode === "view" && courseId) {
      setIsDeleteModalOpen(true);
    } else {
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (mode === "view") {
      setMode("edit");
      return;
    }

    setNameError("");
    setAcronymError("");

    const payload = {
      name: name.trim(),
      acronym: acronym.trim(),
      coordinatorId: coordinatorId.trim() || undefined,
    };

    if (!name) {
      setNameError("O nome do curso é obrigatório.");
      return;
    }

    if (!acronym) {
      setAcronymError("A sigla do curso é obrigatória.");
      return;
    }

    if (mode === "create") {
      const success = await createCourse(payload);
      if (success) {
        onSuccess();
        onClose();
      }
    } else if (mode === "edit" && courseId) {
      const success = await updateCourse(courseId, payload);
      if (success) {
        onSuccess();
        onClose();
      }
    }
  };

  // Confirm Modal to Delete
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!courseId) return;

    const success = await removeCourse(courseId);

    if (success) {
      setIsDeleteModalOpen(false);
      onSuccess();
      onClose();
    }
  };

  const modalTitle =
    mode === "view" ? "Visualizar" : mode === "create" ? "Cadastrar" : "Editar";

  const isViewMode = mode === "view";

  const getInputClass = (error?: string) =>
    `${inputClass} ${error ? "border-red-400 hover:border-red-400 focus:border-red-500" : ""}`;

  return (
    <>
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        onBack={onClose}
        title={`${modalTitle} Curso`}
        footerActions={
          <>
            {mode === "edit" && (
              <CommonButton
                label="Visualizar"
                onClick={() => {
                  setMode("view");
                  setName(courseData?.name || "");
                  setAcronym(courseData?.acronym || "");
                  setCoordinatorId(courseData?.coordinatorId || "");
                }}
                startIcon={Eye}
              />
            )}
            <div className="flex-1" />
            <CommonButton
              label={mode === "view" ? "Remover Curso" : "Cancelar"}
              onClick={handleSecondaryAction}
              className="bg-[#f4a598] hover:bg-[#f0a195] border-[#f0a195] text-white"
            />
            <CommonButton
              label={
                mode === "view"
                  ? "Editar"
                  : mode === "create"
                    ? "Confirmar Cadastro"
                    : "Salvar"
              }
              onClick={handleConfirm}
            />
          </>
        }
      >
        <Field label="Nome do Curso:" required error={nameError}>
          <input
            disabled={isViewMode}
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setNameError("");
            }}
            placeholder="Insira o nome do curso"
            className={getInputClass(nameError)}
          />
        </Field>

        <Field label="Sigla:" required error={acronymError}>
          <input
            disabled={isViewMode}
            type="text"
            value={acronym}
            onChange={(event) => {
              setAcronym(event.target.value);
              setAcronymError("");
            }}
            placeholder="Insira a sigla"
            className={getInputClass(acronymError)}
          />
        </Field>

        {/* <Field label="Coordenador(a) do Curso:">
          <input
            disabled={isViewMode}
            type="text"
            value={coordinatorDisplayValue}
            onChange={(event) => setCoordinatorId(event.target.value)}
            placeholder="Insira o ID do coordenador"
            className={inputClass}
          />
        </Field> */}

        {mode === "view" && courseData && (
          <div className="flex gap-4 text-xs text-stone-500">
            <span>
              <strong>Criado em:</strong> {formatDate(courseData.createdAt)}
            </span>
            <span>
              <strong>Atualizado em:</strong> {formatDate(courseData.updatedAt)}
            </span>
          </div>
        )}
      </FormModal>

      <ConfirmModal
        open={isDeleteModalOpen}
        title="Excluir Curso"
        message={`Tem certeza que deseja excluir o curso ${name}? Esta ação removerá o curso permanentemente do catálogo.`}
        confirmLabel="Excluir"
        confirmColor="critical"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
