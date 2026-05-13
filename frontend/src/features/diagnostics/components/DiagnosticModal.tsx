"use client";

import CommonButton from "@/components/ui/CommonButton";
import { Field } from "@/components/ui/Field";
import { FormModal } from "@/components/ui/FormModal";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useDiagnostics } from "../hooks/useDiagnostics";
import { Diagnostic } from "../types/diagnostic";

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosticId: string | null;
  onSuccess: () => void;
}

export function DiagnosticModal({
  isOpen,
  onClose,
  diagnosticId,
  onSuccess,
}: DiagnosticModalProps) {
  const {
    getDiagnosticsById,
    createDiagnostic,
    updateDiagnostic,
    removeDiagnostic,
  } = useDiagnostics();

  const [mode, setMode] = useState<"create" | "view" | "edit">(
    diagnosticId ? "view" : "create",
  );
  const [name, setName] = useState("");

  const [acronym, setAcronym] = useState("");
  const [cid, setCid] = useState("");

  const [diagnosticData, setDiagnosticData] = useState<Diagnostic | null>(null);

  useEffect(() => {
    if (isOpen && diagnosticId) {
      getDiagnosticsById(diagnosticId).then((data) => {
        if (data) {
          setName(data.name);
          setAcronym(data.acronym ?? "");
          setCid(data.cid ?? "");
          setDiagnosticData(data);
        }
      });
    }
  }, [isOpen, diagnosticId, getDiagnosticsById]);

  const handleSecondaryAction = async () => {
    if (mode === "view" && diagnosticId) {
      const success = await removeDiagnostic(diagnosticId);
      if (success) {
        onSuccess();
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleConfirm = async () => {
    const payload = {
      name: name.trim(),
      acronym: acronym.trim() || undefined,
      cid: cid.trim() || undefined,
    };

    if (mode === "create") {
      const success = await createDiagnostic(payload);
      if (success) {
        onSuccess();
        onClose();
      }
    } else if (mode === "view") {
      setMode("edit");
    } else if (mode === "edit" && diagnosticId) {
      const success = await updateDiagnostic(diagnosticId, payload);
      if (success) {
        onSuccess();
        onClose();
      }
    }
  };

  const modalTitle =
    mode === "view" ? "Visualizar" : mode === "create" ? "Cadastrar" : "Editar";

  const isViewMode = mode === "view";

  const inputClass =
    "w-full px-3.5 py-2.5 border-[1.5px] rounded-md bg-white text-sm text-stone-800 outline-none transition-colors font-sans border-stone-300 hover:border-stone-400 focus:border-teal-400 disabled:text-stone-500 disabled:cursor-not-allowed";

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onBack={onClose}
      title={`${modalTitle} Diagnóstico`}
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
            label={mode === "view" ? "Remover Diagnóstico" : "Cancelar"}
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
      <Field label="Nome do Diagnóstico:" required>
        <input
          disabled={isViewMode}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Insira o nome do diagnóstico"
          className={inputClass}
        />
      </Field>

      <Field label="Sigla:">
        <input
          disabled={isViewMode}
          type="text"
          value={acronym}
          onChange={(event) => setAcronym(event.target.value)}
          placeholder="Insira a sigla"
          className={inputClass}
        />
      </Field>

      <Field label="CID:">
        <input
          disabled={isViewMode}
          type="text"
          value={cid}
          onChange={(event) => setCid(event.target.value)}
          placeholder="Insira o CID"
          className={inputClass}
        />
      </Field>

      {mode === "view" && diagnosticData && (
        <div className="flex gap-4 text-xs text-stone-500">
          <span>
            <strong>Criado em:</strong> {diagnosticData.createdAt}
          </span>
          <span>
            <strong>Atualizado em:</strong> {diagnosticData.updatedAt}
          </span>
        </div>
      )}
    </FormModal>
  );
}
