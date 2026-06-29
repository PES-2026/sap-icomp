"use client";

import CommonButton from "@/components/ui/CommonButton";
import { PATHS } from "@/constants/paths";
import { ApiError } from "@/services/apiError";
import { FileQuestion, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReportErrorStateProps {
  error?: ApiError;
  studentId: string;
}

export function ReportErrorState({ error, studentId }: ReportErrorStateProps) {
  const router = useRouter();
  const forbidden = error?.status === 403;
  const Icon = forbidden ? LockKeyhole : FileQuestion;

  return (
    <div className="flex h-full min-h-96 items-center justify-center p-6">
      <div className="max-w-md text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#6bc4a6] shadow-sm">
          <Icon size={30} />
        </span>
        <h1 className="mt-5 text-xl font-bold text-stone-800">
          {forbidden ? "Acesso negado" : "Relatório não encontrado"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">
          {error?.message ?? "Relatório não localizado no sistema."}
        </p>
        <CommonButton
          label="Voltar ao aluno"
          onClick={() => router.push(PATHS.visualize_student(studentId))}
          className="mx-auto mt-6"
        />
      </div>
    </div>
  );
}
