"use client";

import CommonButton from "@/components/ui/CommonButton";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Field } from "@/components/ui/Field";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDiagnostics } from "../hooks/useDiagnostics";

interface DiagnosticSelectWithCreateProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const ADD_NEW_DIAGNOSTIC = "__add_new_diagnostic__";

export function DiagnosticSelectWithCreate({
  value,
  onChange,
  required = false,
}: DiagnosticSelectWithCreateProps) {
  const { diagnostics, createDiagnostic } = useDiagnostics();

  const [isAddingDiagnostic, setIsAddingDiagnostic] = useState(false);
  const [newDiagnosticName, setNewDiagnosticName] = useState("");
  const [diagnosticError, setDiagnosticError] = useState("");

  const diagnosticOptions = useMemo(() => {
    const options = diagnostics.map((diagnostic) => ({
      value: diagnostic.name,
      label: diagnostic.name,
    }));

    const currentDiagnosis = value.trim();
    const hasCurrentDiagnosis =
      !currentDiagnosis ||
      options.some(
        (option) =>
          option.value.toLowerCase() === currentDiagnosis.toLowerCase(),
      );

    return [
      ...(hasCurrentDiagnosis
        ? options
        : [{ value: currentDiagnosis, label: currentDiagnosis }, ...options]),
      {
        value: ADD_NEW_DIAGNOSTIC,
        label: "Adicionar novo...",
      },
    ];
  }, [diagnostics, value]);

  const handleDiagnosticChange = (selectedValue: string) => {
    if (selectedValue === ADD_NEW_DIAGNOSTIC) {
      setIsAddingDiagnostic(true);
      setNewDiagnosticName("");
      setDiagnosticError("");
      return;
    }

    setIsAddingDiagnostic(false);
    setDiagnosticError("");
    onChange(selectedValue);
  };

  const handleCreateDiagnostic = async () => {
    const normalizedName = newDiagnosticName.trim();

    if (normalizedName.length < 3) {
      const message = "O nome do diagnóstico deve ser preenchido corretamente";
      setDiagnosticError(message);
      toast.error(message);
      return;
    }

    const diagnosticAlreadyExists = diagnostics.some(
      (diagnostic) =>
        diagnostic.name.trim().toLowerCase() === normalizedName.toLowerCase(),
    );

    if (diagnosticAlreadyExists) {
      const message = "Este diagnóstico já existe. Selecione o item da lista.";
      setDiagnosticError(message);
      toast.error(message);
      return;
    }

    const createdDiagnostic = await createDiagnostic({
      name: normalizedName,
    });

    if (createdDiagnostic) {
      onChange(createdDiagnostic.name);
      setIsAddingDiagnostic(false);
      setNewDiagnosticName("");
      setDiagnosticError("");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <CustomSelect
        value={value}
        label="Diagnóstico:"
        onChange={handleDiagnosticChange}
        options={diagnosticOptions}
        required={required}
      />

      {isAddingDiagnostic && (
        <Field label="Novo Diagnóstico:" error={diagnosticError}>
          <div className="flex flex-col gap-2 md:flex-row">
            <input
              type="text"
              placeholder="Insira o nome da nova condição"
              value={newDiagnosticName}
              onChange={(event) => setNewDiagnosticName(event.target.value)}
              className="w-full px-3.5 py-2.5 border-[1.5px] rounded-md bg-white text-sm text-stone-800 outline-none transition-colors font-sans border-stone-300 focus:border-teal-400"
            />
            <CommonButton
              label="Salvar"
              type="button"
              onClick={handleCreateDiagnostic}
            />
          </div>
        </Field>
      )}
    </div>
  );
}
