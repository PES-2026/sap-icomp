"use client";

import { useAttendanceForm } from "@/hooks/useAttendances";
import { useStudentById } from "@/hooks/useStudentById";
import { useParams } from "next/navigation";

export default function AttendanceCard() {
  const params = useParams();
  const studentId = decodeURIComponent((params?.studentId as string) ?? "");
  const attendanceId = decodeURIComponent(
    (params?.attendanceId as string) ?? "",
  );

  const { student } = useStudentById(studentId);
  const { formData } = useAttendanceForm({
    attendanceId,
  });

  // Evita que a tela quebre enquanto os dados estão sendo buscados
  if (!student || !formData) {
    return (
      <div className="flex min-h-[calc(100vh-100px)] items-center justify-center p-4">
        <p className="text-stone-500 animate-pulse font-medium">
          Carregando informações...
        </p>
      </div>
    );
  }

  return (
    // Wrapper centralizado
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center p-4 md:p-8 font-sans">
      {/* Card Principal */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-stone-200 overflow-hidden">
        {/* Cabeçalho do Card: Foco Total no Atendimento (Tipo e Data) */}
        <div className="bg-teal-50/50 px-6 py-5 sm:px-8 sm:py-6 border-b border-teal-100/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-wider text-teal-600 uppercase mb-1">
                Detalhes do Atendimento
              </p>
              <h1 className="text-2xl font-bold text-stone-800">
                {formData.type || "Tipo não informado"}
              </h1>
            </div>

            {/* Badge de Data */}
            <div className="bg-white px-4 py-2 rounded-lg border border-teal-100 shadow-sm w-fit flex items-center gap-2">
              <span className="text-sm font-medium text-teal-700">
                Data: {formData.date || "--/--/----"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Box de Informações do Aluno (Secundário) */}
          <div className="mb-8 bg-stone-50 rounded-xl p-5 border border-stone-200/60">
            <h2 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-4">
              Aluno Vinculado
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p className="text-xs text-stone-500 mb-0.5">Nome</p>
                <p className="text-sm font-medium text-stone-800">
                  {student.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500 mb-0.5">E-mail</p>
                <p
                  className="text-sm font-medium text-stone-800 truncate"
                  title={student.email}
                >
                  {student.email}
                </p>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-stone-200/60">
                <p className="text-xs text-stone-500 mb-0.5">
                  Diagnóstico / Dificuldades
                </p>
                <p className="text-sm font-medium text-stone-800">
                  {/* Validação para mostrar N/A se estiver vazio */}
                  {student.difficulties && student.difficulties.trim() !== ""
                    ? student.difficulties
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Área Principal: Textos do Atendimento */}
          <div className="space-y-6">
            {/* Demanda */}
            <div>
              <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                Demanda Relatada
              </h2>
              <div className="bg-white rounded-lg border border-stone-200 p-4 min-h-20">
                <p className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">
                  {formData.demand || (
                    <span className="text-stone-400 italic">
                      Nenhuma demanda registrada.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Observações Gerais */}
            <div>
              <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                Observações Gerais
              </h2>
              <div className="bg-stone-50/50 rounded-lg border border-stone-200 p-4 min-h-25">
                <p className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">
                  {formData.generalObservations || (
                    <span className="text-stone-400 italic">
                      Nenhuma observação geral registrada.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
