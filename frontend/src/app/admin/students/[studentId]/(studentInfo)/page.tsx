"use client";


import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ConfirmModal } from "@/components/confirm-modal/ConfirmModal";
import {
  ArrowLeft,
  Eye,
  Calendar,
  BookOpen,
  Mail,
  Phone,
  Cake,
} from "lucide-react";
import { cn } from "@/utils/cn";
import CommonButton from "@/components/common-button/CommonButton";
import { SelectInput } from "@/components/select-input/FilterSelect";
import { useAppNavigation } from "@/utils/navigator";
import { PATHS } from "@/constants/paths";
import toast from "react-hot-toast";
import { StudentAttendance } from "@/types/student";
import { AttendanceTypes } from "@/constants/attendance";
import { studentService } from "@/services";


export default function StudentPage() {
  const params = useParams();
  const studentId = decodeURIComponent((params?.studentId as string) ?? "");
  const [student, setStudent] = useState<StudentAttendance>();
  const { handleNavigation } = useAppNavigation();

  const [filterType, setFilterType] = useState<string>("Todos os Tipos");
  const [showDisableStudent, setShowDisableStudent] = useState(false);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const data = await studentService.getStudentById(studentId);
        setStudent(data);
      } catch (error) {
        console.error("Error loading students list:", error);
      }
    };

    fetchStudentInfo();
  }, []);

  const filteredAttendances = student
    ? student.attendances.filter(
        (a) =>
          filterType === "Todos os Tipos" || a.attendanceType === filterType,
      )
    : [];

  if (!student) {
    return (
      <div className="flex h-full items-center justify-center bg-[#f5f0e8] p-4 font-sans">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="mb-2 text-xl font-bold text-[#2a2520]">
            Aluno não encontrado
          </h1>
          <p className="mb-6 text-sm text-[#8a8075]">
            Nenhum aluno com ID{" "}
            <code className="rounded bg-[#e8e0d5] px-1.5 py-0.5 text-xs font-mono text-[#5a5248]">
              {studentId}
            </code>{" "}
            foi localizado.
          </p>
          <a
            href={PATHS.students_list}
            className="inline-flex items-center gap-2 rounded-xl bg-[#6bc4a6] px-5 py-2.5 text-sm font-semibold text-white no-underline transition-all hover:bg-[#52b594]"
          >
            <ArrowLeft size={15} />
            Voltar à lista
          </a>
        </div>
      </div>
    );
  }

  const handleDisableStudent = async () => {
    try {
      await studentService.deleteStudent(studentId);
      window.location.reload();
      toast.success(
        !student.removed
          ? "Aluno inativado com sucesso."
          : "Aluno reativado com sucesso.",
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erro ao comunicar com o servidor.",
      );
    } finally {
      setShowDisableStudent(false);
    }
  };

  return (
    <>
      <main className="flex min-w-0 flex-1 flex-col h-full font-sans bg-[#f5f0e8]">
        <div className="flex flex-1 flex-col p-6 min-h-0 gap-4">
          {/* ── Profile Card ── */}
          <div className="rounded-2xl bg-white shadow-sm border border-[#ede8df] p-5">
            <div className="flex items-start gap-5">
              <CommonButton
                onClick={() => handleNavigation({ isBack: true })}
                label=""
                title="Voltar"
                startIcon={ArrowLeft}
                sizeIcon={20}
                className="flex w-fit items-center gap-0 rounded-xl p-2 text-sm font-semibold text-[#6bc4a6] bg-transparent transition-colors hover:bg-[#f1efe9]"
              />

              {/* Identity + contact info */}
              <div className="flex-1 min-w-0">
                {/* Name + status */}
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-lg font-bold text-[#2a2520] leading-tight truncate">
                    {student.name}
                  </h1>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold",
                      !student.removed
                        ? "bg-[#d4f0e8] text-[#1a6e4e]"
                        : "bg-[#fde8e8] text-[#9b2c2c]",
                    )}
                  >
                    {!student.removed ? "Ativo" : "Inativo"}
                  </span>
                </div>

                {/* Course */}
                <div className="mt-1.5 flex items-center gap-1.5 text-sm text-[#7a7268]">
                  <BookOpen size={13} className="shrink-0 text-[#6bc4a6]" />
                  {student.course}
                </div>

                {/* Contact row */}
                <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1">
                  <span className="flex items-center gap-1.5 text-sm text-[#7a7268]">
                    <Mail size={13} className="shrink-0 text-[#6bc4a6]" />
                    {student.email}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-[#7a7268]">
                    <Phone size={13} className="shrink-0 text-[#6bc4a6]" />
                    {student.phoneNumber}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-[#7a7268]">
                    <Cake size={13} className="shrink-0 text-[#6bc4a6]" />
                    {student.dtBirth}
                  </span>
                </div>
              </div>

              {/* Stat pills */}
              <div className="hidden sm:flex shrink-0 gap-3">
                <div className="rounded-xl bg-[#f5f0e8] px-4 py-2.5 text-center min-w-22.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a0998e] mb-0.5">
                    Matrícula
                  </p>
                  <p className="text-sm font-bold text-[#3a3530]">
                    {student.enrollmentId}
                  </p>
                </div>
                <div className="rounded-xl bg-[#f5f0e8] px-4 py-2.5 text-center min-w-22.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a0998e] mb-0.5">
                    Atendimentos
                  </p>
                  <p className="text-sm font-bold text-[#3a3530]">
                    {student.attendances.length}
                  </p>
                </div>
                <div className="rounded-xl bg-[#fff8ec] px-4 py-2.5 text-center min-w-27.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a0998e] mb-0.5">
                    Necessidades
                  </p>
                  <p className="text-sm font-bold text-[#7a5c1e] leading-tight">
                    {student.difficulties}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── History Card ── */}
          <div className="flex flex-1 flex-col rounded-2xl bg-white shadow-sm overflow-hidden min-h-0">
            {/* Card header */}
            <div className="flex shrink-0 items-center justify-between px-6 py-4 border-b border-[#ede8df]">
              <div>
                <h2 className="text-sm font-bold text-[#2a2520]">
                  Histórico de Atendimentos
                </h2>
                <p className="text-xs text-[#a0998e] mt-0.5">
                  {filteredAttendances.length} registro
                  {filteredAttendances.length !== 1 ? "s" : ""} encontrado
                  {filteredAttendances.length !== 1 ? "s" : ""}
                </p>
              </div>
              <SelectInput
                value={filterType}
                onChange={setFilterType}
                options={AttendanceTypes}
                defaultOption="Todos"
                width="w-55"
              />
            </div>

            {/* Attendance list */}
            <div className="flex-1 p-4 overflow-hidden flex flex-col ">
              <style>{`
                .custom-scroll::-webkit-scrollbar {
                  width: 6px;
                }
                .custom-scroll::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scroll::-webkit-scrollbar-thumb {
                  background-color: #badad1;
                  border-radius: 10px;
                }
                .custom-scroll:hover::-webkit-scrollbar-thumb {
                  background-color: #6bc4a6;
                }
              `}</style>
              <div className="flex-1 flex flex-col overflow-hidden rounded-2xl bg-[#d4f0e8] ring-1 ring-[#badad1]">
                <div className="custom-scroll flex-1 overflow-y-auto divide-y divide-[#badad1]">
                  {filteredAttendances.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f0e8]">
                        <Calendar size={20} className="text-[#b0a898]" />
                      </div>
                      <p className="text-sm font-medium text-[#7a7268]">
                        Nenhum atendimento encontrado
                      </p>
                      <p className="mt-1 text-xs text-[#a0998e]">
                        Tente ajustar o filtro de tipo.
                      </p>
                    </div>
                  ) : (
                    filteredAttendances.map((attendance, idx) => (
                      <div
                        key={attendance.attendanceId}
                        className="group flex items-center justify-between px-6 py-4 transition-colors duration-100 hover:bg-[#cde9e1]"
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm font-semibold text-[#2a2520]">
                              {attendance.attendanceType}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-[#1a6e4e]">
                              <Calendar size={11} />
                              {attendance.attendanceDate}
                            </p>
                          </div>
                        </div>

                        <button
                          title="Visualizar detalhes do atendimento"
                          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#6bc4a6] opacity-0 transition-all duration-150 group-hover:opacity-100 hover:bg-[#e8f7f2]"
                        >
                          <Eye size={14} />
                          Ver detalhes
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer Actions ── */}
          <div className="shrink-0 rounded-2xl bg-white shadow-sm border border-[#ede8df] p-4">
            <div className="flex flex-wrap items-center gap-3">
              <CommonButton
                label={!student.removed ? "Inativar Aluno" : "Reativar Aluno"}
                onClick={() => setShowDisableStudent(true)}
                className={cn(
                  "text-sm font-semibold",
                  !student.removed
                    ? "bg-[#fde8e8] text-[#9b2c2c] hover:bg-[#fbd5d5]"
                    : "bg-[#e8f7f2] text-[#1a6e4e] hover:bg-[#d4f0e8]",
                )}
              />

              <div className="h-4 w-px bg-[#e8e0d5]" />

              <div className="flex flex-wrap gap-4 text-xs text-[#a0998e]">
                <span>
                  <span className="font-semibold text-[#6a6258]">
                    Criado em
                  </span>{" "}
                  {student.createdAt}
                </span>
                <span>
                  <span className="font-semibold text-[#6a6258]">
                    Atualizado em
                  </span>{" "}
                  {student.updatedAt}
                </span>
              </div>

              <div className="flex-1" />

              <div className="flex gap-2.5">
                <CommonButton
                  label="Criar Relatório"
                  onClick={() => toast.success("Relatório gerado!")}
                  className="bg-[#f5f0e8] text-[#5a5248] hover:bg-[#ede8df] text-sm font-semibold"
                />
                <CommonButton
                  label="Fazer Registro"
                  onClick={() => toast.success("Registro adicionado!")}
                  className="bg-[#6bc4a6] text-white hover:bg-[#52b594] text-sm font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <ConfirmModal
        open={showDisableStudent}
        title={!student.removed ? "Inativar Aluno" : "Reativar Aluno"}
        message={
          !student.removed
            ? `Tem certeza que deseja inativar ${student.name}? O aluno não aparecerá mais na listagem ativa.`
            : `Deseja reativar ${student.name}? O aluno voltará à listagem ativa.`
        }
        confirmLabel={!student.removed ? "Inativar" : "Reativar"}
        confirmColor={!student.removed ? "critical" : "primary"}
        onConfirm={handleDisableStudent}
        onCancel={() => setShowDisableStudent(false)}
      />
    </>
  );
}
