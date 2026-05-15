"use client";

import CommonButton from "@/components/ui/CommonButton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Field } from "@/components/ui/Field";
import { FormModal } from "@/components/ui/FormModal";
import { formatDate } from "@/utils/utils";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useAttendanceTypes } from "../hooks/useAttendanceTypes";
import { AttendanceType } from "../types/attendanceType";

interface AttendanceTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceTypeId: string | null;
  onSuccess: () => void;
}

export function AttendanceTypeModal({
  isOpen,
  onClose,
  attendanceTypeId,
  onSuccess,
}: AttendanceTypeModalProps) {
  const { getTypeById, createType, updateType, removeType } =
    useAttendanceTypes();

  const [mode, setMode] = useState<"create" | "view" | "edit">("create");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const [attendanceTypeData, setAttendanceTypeData] =
    useState<AttendanceType | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (attendanceTypeId) {
        setMode("view");
        getTypeById(attendanceTypeId).then((data) => {
          if (data) {
            setName(data.name);
            setAttendanceTypeData(data);
          }
        });
      } else {
        setMode("create");
        setName("");
        setAttendanceTypeData(null);
      }
    }
  }, [isOpen, attendanceTypeId]);

  const handleSecondaryAction = async () => {
    if (mode === "view" && attendanceTypeId) {
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

    if (!name) {
      setNameError("O nome do tipo é obrigatório!");
      return;
    }

    if (mode === "create") {
      const success = await createType(name);
      if (success) {
        onSuccess();
        onClose();
      }
    } else if (mode === "edit" && attendanceTypeId) {
      const success = await updateType(attendanceTypeId, name);
      if (success) {
        onSuccess();
        onClose();
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!attendanceTypeId) return;

    const success = await removeType(attendanceTypeId);

    if (success) {
      setIsDeleteModalOpen(false);
      onSuccess();
      onClose();
    }
  };

  const modalTitle =
    mode === "view" ? "Visualizar" : mode === "create" ? "Cadastrar" : "Editar";

  const inputClass =
    "w-full px-3.5 py-2.5 border-[1.5px] rounded-md bg-white text-sm text-stone-800 outline-none transition-colors font-sans border-stone-300 hover:border-stone-400 focus:border-teal-400 disabled:text-stone-500 disabled:cursor-not-allowed";

  const getInputClass = (error?: string) =>
    `${inputClass} ${error ? "border-red-400 hover:border-red-400 focus:border-red-500" : ""}`;

  return (
    <>
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        onBack={onClose}
        title={`${modalTitle} Tipo de Atendimento`}
        footerActions={
          <>
            {mode === "edit" && (
              <CommonButton
                label="Visualizar"
                onClick={() => setMode("view")}
                startIcon={Eye}
              />
            )}
            <div className="flex-1" />
            <CommonButton
              label={mode === "view" ? "Remover Tipo" : "Cancelar"}
              onClick={handleSecondaryAction}
              className="bg-[#f4a598] hover:bg-[#f0a195] border-[#f0a195] text-white"
            />
            <CommonButton
              label={mode === "view" ? "Editar" : "Confirmar"}
              onClick={handleConfirm}
            />
          </>
        }
      >
        <Field label="Tipo de Atendimento:" error={nameError}>
          <input
            disabled={mode === "view"}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Insira um Tipo de Atendimento"
            className={getInputClass(nameError)}
          />
        </Field>

        {mode === "view" && attendanceTypeData && (
          <div className="flex gap-4 text-xs text-stone-500">
            <span>
              <strong>Criado em:</strong>{" "}
              {formatDate(attendanceTypeData.createdAt)}
            </span>
            <span>
              <strong>Atualizado em:</strong>{" "}
              {formatDate(attendanceTypeData.updatedAt)}
            </span>
          </div>
        )}
      </FormModal>
      <ConfirmModal
        open={isDeleteModalOpen}
        title="Excluir Diagnóstico"
        message={`Tem certeza que deseja excluir o diagnóstico ${name}? Esta ação não poderá ser desfeita.`}
        confirmLabel="Excluir"
        confirmColor="critical"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
