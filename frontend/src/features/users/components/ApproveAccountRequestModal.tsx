"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import CommonButton from "@/components/ui/CommonButton";

import { PendingAccountRequestItem, UserRole } from "../types/user";

interface ApproveAccountRequestModalProps {
  request: PendingAccountRequestItem;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (role: UserRole) => void;
}

const roleOptions: {
  value: UserRole;
  label: string;
  description: string;
}[] = [
  {
    value: "PROFESSOR",
    label: "Professor(a)",
    description: "Tem acesso aos relatórios dos alunos vinculados a ele.",
  },
  {
    value: "PEDAGOGUE",
    label: "Pedagogo(a)",
    description: "Tem acesso às funcionalidades de administrador do sistema.",
  },
];

export default function ApproveAccountRequestModal({
  request,
  isLoading,
  onClose,
  onConfirm,
}: ApproveAccountRequestModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("PROFESSOR");

  const selectedRoleLabel = roleOptions.find(
    (option) => option.value === selectedRole,
  )?.label;

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-1000 flex items-center justify-center bg-black/40 p-4"
      onClick={handleClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="approve-account-request-title"
        className="w-full max-w-2xl rounded-2xl border border-[#ece7db] bg-[#faf7f0] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.18)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="approve-account-request-title"
          className="text-center text-2xl font-extrabold text-[#3a3530]"
        >
          Aprovar usuário
        </h2>

        <p className="mt-2 text-center text-sm text-[#6a6560]">
          Selecione o papel do usuário no sistema:
        </p>

        <fieldset className="mt-6 flex flex-col gap-3" disabled={isLoading}>
          <legend className="sr-only">Papel do usuário</legend>

          {roleOptions.map((option) => {
            const isSelected = selectedRole === option.value;

            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                  isSelected
                    ? "border-[#6bc4a6] bg-emerald-50"
                    : "border-[#d8e4e8] bg-[#eaf5f8] hover:border-[#9bcfbd]"
                } ${isLoading ? "cursor-not-allowed opacity-70" : ""}`}
              >
                <input
                  type="radio"
                  name="approval-role"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => setSelectedRole(option.value)}
                  className="mt-1 h-4 w-4 accent-[#52b594]"
                />

                <span className="text-sm leading-5 text-[#4a4540]">
                  <strong>{option.label}:</strong> {option.description}
                </span>
              </label>
            );
          })}
        </fieldset>

        <p className="mx-auto mt-7 max-w-xl text-center text-base leading-6 text-[#4a4540]">
          Você tem certeza que deseja aprovar <strong>{request.name}</strong>{" "}
          para o papel de <strong>{selectedRoleLabel}</strong>?
        </p>

        <div className="mt-7 flex flex-col-reverse justify-center gap-3 sm:flex-row">
          <CommonButton
            type="button"
            label="Voltar"
            onClick={handleClose}
            disabled={isLoading}
            className="min-w-40 justify-center border border-[#ef9c8d] bg-[#f4a598] text-white hover:bg-[#ef9c8d] disabled:cursor-not-allowed disabled:opacity-60"
          />

          <CommonButton
            type="button"
            label={isLoading ? "Aprovando..." : "Aprovar"}
            startIcon={isLoading ? Loader2 : undefined}
            onClick={() => onConfirm(selectedRole)}
            disabled={isLoading}
            className="min-w-40 justify-center disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:animate-spin"
          />
        </div>
      </section>
    </div>
  );
}
