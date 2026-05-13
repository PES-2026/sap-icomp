"use client";

import CommonButton from "@/components/ui/CommonButton";
import { Field } from "@/components/ui/Field";
import { FormModal } from "@/components/ui/FormModal";
import { useState } from "react";
import { Diagnostic, DiagnosticPayload } from "../types/diagnostic";

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnostic: Diagnostic | null; // mudar para string --> diagnosticId
  diagnostics: Diagnostic[]; // remover
  onCreate: (data: DiagnosticPayload) => Promise<Diagnostic | null>; // remover
  onUpdate: (id: string, data: DiagnosticPayload) => Promise<boolean>; // remover
}

export function DiagnosticModal({
  isOpen,
  onClose,
  diagnostic,
  diagnostics,
  onCreate,
  onUpdate,
}: DiagnosticModalProps) {

  // Trazer os hooks de create, update e remove para cá
  const [name, setName] = useState(diagnostic?.name ?? "");
  const [acronym, setAcronym] = useState(diagnostic?.acronym ?? "");

  // Renomear para camelCase --> cid, setCid
  const [CID, setCID] = useState(diagnostic?.CID ?? "");
  const [nameError, setNameError] = useState("");

  const isEditMode = !!diagnostic;

  // Remover o parâmetro **diagnostics** desse componente
  // Remover essa validação, ela será feita no backend
  const validateName = () => {
    const normalizedName = name.trim().toLowerCase();

    if (normalizedName.length < 3) {
      setNameError("O nome do diagnóstico deve ser preenchido corretamente");
      return false;
    }

    const alreadyExists = diagnostics.some((item) => {
      const sameName = item.name.trim().toLowerCase() === normalizedName;
      const differentDiagnostic = item.externalId !== diagnostic?.externalId;

      return sameName && differentDiagnostic;
    });

    if (alreadyExists) {
      setNameError("Este diagnóstico já existe. Selecione o item da lista.");
      return false;
    }

    setNameError("");
    return true;
  };

  /* A lógica do handleConfirm deve seguir a mesma lógica do attendanceTypes

  // O mode controla o estado do modal, ele define se será a visualização de criar,
  // atualizar ou de visualizar.
  const [mode, setMode] = useState<"create" | "view" | "edit">("create");
  
  // Conterá o nosso elemento exibido no modal.
  // Ou seja, o componente receberá apenas o id e fará a pesquisa por esse id. 
  const [attendanceTypeData, setAttendanceTypeData] =
      useState<AttendanceType | null>(null);
   
  falar das outras funções...
  */
  const handleConfirm = async () => {
    if (!validateName()) return; // remover essa validação

    const payload: DiagnosticPayload = {
      name: name.trim(),
      acronym: acronym.trim() || undefined,
      CID: CID.trim() || undefined, // renomear para "cid"
    };

    const result =
      isEditMode && diagnostic
        ? await onUpdate(diagnostic.externalId, payload)
        : await onCreate(payload);

    if (result) onClose();
  };

  const inputClass =
    "w-full px-3.5 py-2.5 border-[1.5px] rounded-md bg-white text-sm text-stone-800 outline-none transition-colors font-sans border-stone-300 hover:border-stone-400 focus:border-teal-400";

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onBack={onClose}
      title={`${isEditMode ? "Editar" : "Cadastrar"} Diagnóstico`}
      footerActions={
        <>
          <CommonButton
            label="Cancelar"
            onClick={onClose}
            className="bg-[#f4a598] hover:bg-[#f0a195] border-[#f0a195] text-white"
          />
          <CommonButton label="Confirmar" onClick={handleConfirm} />
        </>
      }
    >
      <Field label="Nome do Diagnóstico:" error={nameError} required>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Insira o nome do diagnóstico"
          className={
            nameError
              ? `${inputClass} border-red-300 bg-red-50 focus:border-red-400`
              : inputClass
          }
        />
      </Field>

      <Field label="Sigla:">
        <input
          type="text"
          value={acronym}
          onChange={(event) => setAcronym(event.target.value)}
          placeholder="Insira a sigla"
          className={inputClass}
        />
      </Field>

      <Field label="CID:">
        <input
          type="text"
          value={CID}
          onChange={(event) => setCID(event.target.value)}
          placeholder="Insira o CID"
          className={inputClass}
        />
      </Field>
    </FormModal>
  );
}
