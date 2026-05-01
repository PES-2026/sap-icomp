"use client";

import { PATHS } from "@/constants/paths";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useStudentById } from "../../hooks/useStudentById";
import AttendanceHistoryCard from "./AttendanceHistoryCard";
import StudentFooter from "./StudentFooter";
import StudentProfileCard from "./StudentProfileCard";

export default function StudentInfo() {
  const params = useParams();
  const studentId = decodeURIComponent((params?.studentId as string) ?? "");

  const { student, isLoadingStudent } = useStudentById(studentId);

  if (isLoadingStudent) {
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

  return (
    <>
      <main className="flex min-w-0 flex-1 flex-col h-full font-sans bg-[#f5f0e8]">
        <div className="flex flex-1 flex-col p-6 min-h-0 gap-4">
          <StudentProfileCard student={student} />
          <AttendanceHistoryCard studentId={studentId} />
          <StudentFooter student={student} />
        </div>
      </main>
    </>
  );
}
