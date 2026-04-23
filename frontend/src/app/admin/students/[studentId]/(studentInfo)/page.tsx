"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ConfirmModal } from "@/components/confirm-modal/ConfirmModal";
import { ArrowLeft, Edit, Eye } from "lucide-react";
import { cn } from "@/utils/cn";
import CommonButton from "@/components/common-button/CommonButton";
import { SelectInput } from "@/components/select-input/FilterSelect";
import { SpecialNeed } from "@/types/specialNeed";
import { useAppNavigation } from "@/utils/navigator";
import { PATHS } from "@/constants/paths";
import toast from "react-hot-toast";

type AttendanceType =
  | "Atendimento"
  | "Primeiro Contato / Atendimento"
  | "Alinhamento"
  | "Orientação"
  | "Outro";

interface Attendance {
  id: string;
  date: string;
  type: AttendanceType;
}

interface Student {
  id: string;
  registration: string;
  fullName: string;
  course: string;
  period: number;
  activeNeed: SpecialNeed;
  isActive: boolean;
  attendances: Attendance[];
}

const STUDENTS_DB: Record<string, Student> = {
  "1234-5678": {
    id: "1234-5678",
    registration: "1234-5678",
    fullName: "João Vitor Mesquita da Frota",
    course: "Engenharia de Software",
    period: 5,
    activeNeed: "TDAH TAG",
    isActive: true,
    attendances: [
      { id: "a1", date: "26/03/2026", type: "Atendimento" },
      { id: "a2", date: "23/03/2026", type: "Atendimento" },
      { id: "a3", date: "19/03/2026", type: "Atendimento" },
      { id: "a4", date: "16/03/2026", type: "Primeiro Contato / Atendimento" },
      { id: "a5", date: "12/03/2026", type: "Atendimento" },
      { id: "a6", date: "10/03/2026", type: "Alinhamento" },
      { id: "a7", date: "09/03/2026", type: "Orientação" },
    ],
  },
  "1234-7985": {
    id: "1234-7985",
    registration: "1234-7985",
    fullName: "David Yan dos Santos Prado",
    course: "Ciência da Computação",
    period: 3,
    activeNeed: "TEA",
    isActive: true,
    attendances: [
      { id: "b1", date: "17/02/2026", type: "Atendimento" },
      { id: "b2", date: "10/02/2026", type: "Alinhamento" },
      { id: "b3", date: "03/02/2026", type: "Orientação" },
      { id: "c1", date: "04/01/2026", type: "Atendimento" },
      { id: "c2", date: "28/12/2025", type: "Primeiro Contato / Atendimento" },
      { id: "b12", date: "17/02/2026", type: "Atendimento" },
      { id: "b22", date: "10/02/2026", type: "Alinhamento" },
      { id: "b32", date: "03/02/2026", type: "Orientação" },
      { id: "c12", date: "04/01/2026", type: "Atendimento" },
      { id: "c23", date: "28/12/2025", type: "Primeiro Contato / Atendimento" },
      { id: "b14", date: "17/02/2026", type: "Atendimento" },
      { id: "b24", date: "10/02/2026", type: "Alinhamento" },
      { id: "b36", date: "03/02/2026", type: "Orientação" },
      { id: "c17", date: "04/01/2026", type: "Atendimento" },
      { id: "c28", date: "28/12/2025", type: "Primeiro Contato / Atendimento" },
    ],
  },
  "1234-3456": {
    id: "1234-3456",
    registration: "1234-3456",
    fullName: "Lucas Eduardo Souza de Moura",
    course: "Análise e Desenvolvimento de Sistemas",
    period: 7,
    activeNeed: "PCD",
    isActive: true,
    attendances: [
      { id: "c1", date: "04/01/2026", type: "Atendimento" },
      { id: "c2", date: "28/12/2025", type: "Primeiro Contato / Atendimento" },
    ],
  },
  "1234-7423": {
    id: "1234-7423",
    registration: "1234-7423",
    fullName: "Maria Eduarda Costa Lyra do Nascimento",
    course: "Sistemas de Informação",
    period: 1,
    activeNeed: "Dificuldade de aprendizado",
    isActive: true,
    attendances: [
      { id: "d1", date: "10/02/2026", type: "Atendimento" },
      { id: "d2", date: "05/02/2026", type: "Orientação" },
    ],
  },
  "1234-6984": {
    id: "1234-6984",
    registration: "1234-6984",
    fullName: "Thiago Vinícius Costa Guimarães",
    course: "Outros",
    period: 9,
    activeNeed: "Nenhuma",
    isActive: true,
    attendances: [{ id: "e1", date: "11/03/2026", type: "Atendimento" }],
  },
};

const ALL_TYPES: AttendanceType[] = [
  "Atendimento",
  "Primeiro Contato / Atendimento",
  "Alinhamento",
  "Orientação",
  "Outro",
];

export default function StudentPage() {
  const params = useParams();
  const id = decodeURIComponent((params?.studentId as string) ?? "");

  const student = STUDENTS_DB[id] ?? null;

  const { handleNavigation } = useAppNavigation();

  const [isActive, setIsActive] = useState<boolean>(student?.isActive ?? true);
  const [filterType, setFilterType] = useState<string>("Todos os Tipos");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleToggleActive = () => {
    setIsActive((prev) => !prev);
    setShowConfirm(false);
    toast.success(
      isActive
        ? "Aluno inativado com sucesso."
        : "Aluno reativado com sucesso.",
    );
  };

  const filteredAttendances = student
    ? student.attendances.filter(
        (a) => filterType === "Todos os Tipos" || a.type === filterType,
      )
    : [];

  if (!student) {
    return (
      <div className="flex h-full items-center justify-center bg-[#f5f0e8] p-4 font-sans">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 text-[64px] leading-none">🔍</div>
          <h1 className="mb-2 text-2xl font-extrabold text-[#3a3530]">
            Aluno não encontrado
          </h1>
          <p className="text-sm text-[#8a8075]">
            Nenhum aluno com ID <strong>{id}</strong> foi localizado.
          </p>
          <a
            href={PATHS.students_list}
            className={cn(
              "mt-6 inline-flex items-center justify-center gap-2",
              "rounded-[10px] bg-[#6bc4a6] px-6 py-2.5",
              "text-[13px] font-bold text-white no-underline",
              "transition-colors duration-150 hover:bg-[#52b594]",
            )}
          >
            <ArrowLeft size={16} />
            <span>Voltar à lista</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="flex min-w-0 flex-1 flex-col h-full font-sans">
        {/* ── Content ── */}
        <div className="flex flex-1 flex-col p-7 min-h-0">
          <div className="flex flex-1 flex-col gap-7 overflow-hidden rounded-2xl bg-white p-7 shadow-[0_2px_16px_rgba(107,196,166,0.10)] min-h-0">
            {/* Student header */}
            <div className="shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="mb-2 text-2xl font-bold text-[#3a3530]">
                    {student.fullName} - {student.registration}
                  </h1>
                  <div className="flex items-center gap-2.5">
                    <p className="m-0 text-sm text-[#8a8075]">
                      {student.course}
                    </p>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-sm font-bold",
                        isActive
                          ? "bg-[#d4edda] text-[#155724]"
                          : "bg-[#f8d7da] text-[#721c24]",
                      )}
                    >
                      {isActive ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>

                {/* Info pills */}
                <div className="flex shrink-0 flex-wrap justify-end gap-2.5">
                  <div className="rounded-[10px] bg-[#f5f0e8] px-3.5 py-1.5 text-center">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#a0a098]">
                      Período
                    </div>
                    <div className="text-sm font-bold text-[#3a3530]">
                      {student.period}º
                    </div>
                  </div>
                  <div className="rounded-[10px] bg-[#f5f0e8] px-3.5 py-1.5 text-center">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#a0a098]">
                      Necessidade
                    </div>
                    <div className="text-sm font-bold text-[#3a3530]">
                      {student.activeNeed}
                    </div>
                  </div>
                  <div className="rounded-[10px] bg-[#f5f0e8] px-3.5 py-1.5 text-center">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#a0a098]">
                      Atendimentos
                    </div>
                    <div className="text-sm font-bold text-[#3a3530]">
                      {student.attendances.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* History card */}
            <div className="flex flex-1 flex-col min-h-0">
              <div className="flex flex-1 flex-col overflow-hidden rounded-[14px] border border-[#c5e8dc] bg-[#e8f7f2] min-h-0">
                {/* Card header */}
                <div className="flex shrink-0 items-center justify-between border-b border-[#c5e8dc] px-5 pb-3 pt-3.5">
                  <div className="text-base font-bold text-[#3a3530]">
                    Histórico de Atendimentos
                  </div>

                  {/* Dropdown filter */}
                  <SelectInput
                    value={filterType}
                    onChange={setFilterType}
                    options={ALL_TYPES}
                    defaultOption="Todos"
                    width="w-55"
                  />
                </div>

                {/* Attendance list */}
                <div className="flex-1 overflow-y-auto">
                  {filteredAttendances.length === 0 ? (
                    <div className="px-5 py-8 text-center text-sm text-[#8a9e96]">
                      Nenhum atendimento encontrado para este filtro.
                    </div>
                  ) : (
                    filteredAttendances.map((attendance) => (
                      <div
                        key={attendance.id}
                        className="group flex items-center justify-between border-b border-[#c5e8dc] px-5 py-3.5 transition-colors duration-150 last:border-none hover:bg-[#d4f0e8]"
                      >
                        <div>
                          <div className="text-sm text-[#3a3530]">
                            <strong>Data:</strong> {attendance.date}
                          </div>
                          <div className="mt-0.5 text-sm text-[#5a7a70]">
                            <strong>Tipo:</strong> {attendance.type}
                          </div>
                        </div>

                        <button
                          title="Visualizar detalhes do atendimento"
                          className="flex rounded-md p-1 text-[#6bc4a6] transition-colors duration-150 hover:bg-[#e8f7f2]"
                        >
                          <Eye size={20} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex shrink-0 flex-wrap gap-3">
              <CommonButton
                label={isActive ? "Inativar Aluno" : "Reativar Aluno"}
                onClick={() => setShowConfirm(true)}
                className={
                  isActive
                    ? "bg-[#f4a598] text-white hover:bg-[#f0a195]"
                    : "bg-[#6bc4a6] text-white hover:bg-[#52b594]"
                }
              />
              <CommonButton
                label="Editar Aluno"
                endIcon={Edit}
                onClick={() =>
                  handleNavigation({
                    path: `/admin/students/${student.id}/editar`,
                  })
                }
              />

              <div className="flex-1" />

              <CommonButton
                label="Criar Relatório"
                onClick={() => toast.success("Relatório gerado!")}
              />

              <CommonButton
                label="Fazer Registro"
                onClick={() => toast.success("Registro adicionado!")}
              />
            </div>
          </div>
        </div>
      </main>

      {/* ── Confirm Modal ── */}
      <ConfirmModal
        open={showConfirm}
        title={isActive ? "Inativar Aluno" : "Reativar Aluno"}
        message={
          isActive
            ? `Tem certeza que deseja inativar ${student.fullName}? O aluno não aparecerá mais na listagem ativa.`
            : `Deseja reativar ${student.fullName}? O aluno voltará à listagem ativa.`
        }
        confirmLabel={isActive ? "Inativar" : "Reativar"}
        confirmColor={isActive ? "critical" : "primary"}
        onConfirm={handleToggleActive}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
