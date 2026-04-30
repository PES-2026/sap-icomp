"use client";

import { useState } from "react";
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
  UserRoundX,
  FileText,
  Plus,
  Edit,
  FileX,
  Loader2,
  Edit2,
  UserPen,
} from "lucide-react";
import { cn } from "@/utils/cn";
import CommonButton from "@/components/common-button/CommonButton";
import { SelectInput } from "@/components/select-input/FilterSelect";
import { useAppNavigation } from "@/utils/navigator";
import { PATHS } from "@/constants/paths";
import toast from "react-hot-toast";
import { studentService } from "@/services";
import { attendanceService } from "@/services/attendanceService";
import Link from "next/link";
import { useAttendanceTypesOptions } from "@/hooks/useAttendanceTypesOptions";
import { useStudentById } from "@/hooks/useStudentById";
import { useAttendancesByStudent } from "@/hooks/useAttendancesByStudent";

export default function StudentInfo() {
  const params = useParams();
  const studentId = decodeURIComponent((params?.studentId as string) ?? "");

  const { handleNavigation } = useAppNavigation();

  const [filterType, setFilterType] = useState<string>("Todos os tipos");
  const [attendanceId, setAttendanceId] = useState<string>("");

  const [showDisableStudent, setShowDisableStudent] = useState<boolean>(false);
  const [showDisableAttendance, setShowDisableAttendance] =
    useState<boolean>(false);

  const { student, isLoadingStudent } = useStudentById(studentId);
  const { attendancesByStudent, isLoadingAttendancesByStudent } =
    useAttendancesByStudent(studentId);
  const { attendanceTypesOptions } = useAttendanceTypesOptions();

  // const fetchStudentInfo = async () => {
  //   try {
  //     const data = await studentService.getStudentById(studentId);
  //     setStudent(data);
  //   } catch (error) {
  //     console.error("Error loading students info:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchStudentInfo();
  // }, []);

  const filteredAttendances = student
    ? attendancesByStudent.filter(
        (a) =>
          filterType === "Todos os tipos" || a.attendanceType === filterType,
      )
    : [];

  const handleDisableAttendance = async () => {
    try {
      await attendanceService.removeAttendance(attendanceId);
      toast.success(`Atendimento desativado com sucesso: ${attendanceId}`);
      // fetchStudentInfo();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erro ao comunicar com o servidor.",
      );
    } finally {
      setShowDisableAttendance(false);
      setAttendanceId("");
    }
  };

  if (isLoadingStudent || isLoadingAttendancesByStudent) {
    return (
      <div className="flex h-full w-full items-center justify-center p-7">
        <div className="flex flex-col items-center gap-3 text-[#6a6560]">
          <Loader2 className="animate-spin text-[#6bc4a6]" size={32} />
          <p>Carregando dados do aluno...</p>
        </div>
      </div>
    );
  }

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
      toast.success(
        !student.removed
          ? "Aluno inativado com sucesso."
          : "Aluno reativado com sucesso.",
      );
      // fetchStudentInfo();
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
          <div className="rounded-2xl bg-white shadow-sm p-5">
            <div className="flex items-start gap-5">
              <CommonButton
                onClick={() => handleNavigation({ path: PATHS.students_list })}
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
                        ? "bg-emerald-100 text-[#6bc4a6]"
                        : "bg-red-100 text-red-400",
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
                    {filteredAttendances.length}
                  </p>
                </div>
                <div className="rounded-xl bg-[#fff8ec] px-4 py-2.5 text-center min-w-27.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a0998e] mb-0.5">
                    Necessidades
                  </p>
                  <p className="text-sm font-bold text-[#7a5c1e] leading-tight">
                    {student.difficulties ?? "N/A"}
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
                options={attendanceTypesOptions}
                placeholder="Todos"
                width="w-55"
              />
            </div>

            {/* Renderização Condicional do Loader vs Lista de Atendimentos */}
            {isLoadingAttendancesByStudent ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#53bb98] mb-3" />
                <p className="text-sm font-medium text-[#7a7268]">
                  Carregando atendimentos do aluno...
                </p>
              </div>
            ) : (
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
                          key={idx}
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

                          <div className="flex gap-1">
                            <Link
                              href={PATHS.visualize_attendance(
                                studentId,
                                attendance.attendanceId,
                              )}
                              title="Visualizar"
                              className="flex items-center rounded-md p-1 text-[#53bb98] transition-colors duration-150 hover:bg-[#a5e1cd]"
                            >
                              <Eye size={20} />
                            </Link>
                            <Link
                              href={PATHS.edit_attendance(
                                studentId,
                                attendance.attendanceId,
                              )}
                              title="Editar"
                              className="flex items-center rounded-md p-1 text-[#b0a898] transition-colors duration-150 hover:bg-[#d0d0d0]"
                            >
                              <Edit size={20} />
                            </Link>
                            <CommonButton
                              label=""
                              title="Inativar"
                              onClick={() => {
                                setAttendanceId(attendance.attendanceId);
                                setShowDisableAttendance(true);
                              }}
                              startIcon={FileX}
                              sizeIcon={20}
                              className="flex items-center rounded-md p-1 text-red-400 transition-colors duration-150 bg-transparent hover:bg-red-200 gap-0"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Footer Actions ── */}
          <div className="shrink-0 rounded-2xl bg-white shadow-sm p-4">
            <div className="flex flex-wrap items-center gap-3">
              <CommonButton
                label={student.removed ? "Reativar Aluno" : "Inativar Aluno"}
                onClick={() => setShowDisableStudent(true)}
                endIcon={UserRoundX}
                sizeIcon={20}
                className={cn(
                  "text-sm font-semibold bg-transparent",
                  student.removed
                    ? "hover:bg-emerald-100 ring-1 ring-emerald-400 text-emerald-400"
                    : "hover:bg-red-100 ring-1 ring-red-400 text-red-400",
                )}
              />

              <CommonButton
                label="Editar Aluno"
                onClick={() =>
                  handleNavigation({ path: PATHS.edit_student(studentId) })
                }
                endIcon={UserPen}
                sizeIcon={20}
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
                {/* <CommonButton
                  label="Criar Relatório"
                  endIcon={FileText}
                  onClick={() => toast.success("Relatório gerado!")}
                  className="bg-[#f5f0e8] text-[#5a5248] hover:bg-[#ede8df] text-sm font-semibold"
                /> */}
                <CommonButton
                  label="Fazer Registro"
                  endIcon={Plus}
                  onClick={() =>
                    handleNavigation({
                      path: PATHS.register_attendance(studentId),
                    })
                  }
                  className="bg-[#6bc4a6] text-white hover:bg-[#52b594] text-sm font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal confirm to disable student */}
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

      {/* Modal confirm to delete attendance */}
      <ConfirmModal
        open={showDisableAttendance}
        title="Inativar Atendimento"
        message="Tem certeza que deseja inativar o atendimento?"
        confirmLabel="Inativar"
        confirmColor="critical"
        onConfirm={handleDisableAttendance}
        onCancel={() => {
          setShowDisableAttendance(false);
          setAttendanceId("");
        }}
      />
    </>
  );
}
