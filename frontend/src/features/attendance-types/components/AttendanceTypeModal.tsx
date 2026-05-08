"use client";

import CommonButton from "@/components/ui/CommonButton";
import { Field } from "@/components/ui/Field";
import { FormModal } from "@/components/ui/FormModal";
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

  const [attendanceTypeData, setAttendanceTypeData] =
    useState<AttendanceType | null>(null);

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
      const success = await removeType(attendanceTypeId);
      if (success) {
        onSuccess();
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (mode === "create") {
      const success = await createType(name);
      if (success) {
        onSuccess();
        onClose();
      }
    } else if (mode === "view") {
      setMode("edit");
    } else if (mode === "edit" && attendanceTypeId) {
      const success = await updateType(attendanceTypeId, name);
      if (success) {
        onSuccess();
        onClose();
      }
    }
  };

  const modalTitle =
    mode === "view" ? "Visualizar" : mode === "create" ? "Cadastrar" : "Editar";

  return (
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
      <Field label="Tipo de Atendimento:">
        <input
          disabled={mode === "view"}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Insira um Tipo de Atendimento"
          className="w-full px-3.5 py-2.5 border-[1.5px] rounded-md bg-white text-sm text-stone-800 outline-none transition-colors font-sans border-stone-300 hover:border-stone-400 focus:border-teal-400 disabled:text-stone-500 disabled:cursor-not-allowed"
        />
      </Field>

      {mode === "view" && attendanceTypeData && (
        <div className="flex gap-4 text-xs text-stone-500">
          <span>
            <strong>Criado em:</strong> {attendanceTypeData.createdAt}
          </span>
          <span>
            <strong>Atualizado em:</strong> {attendanceTypeData.updatedAt}
          </span>
        </div>
      )}
    </FormModal>
  );
}
