"use client";

import StudentTable, { Student } from "@/components/tables/StudentTable";
import { Plus } from "lucide-react";
import { useState } from "react";

const INITIAL_STUDENTS: Student[] = [
  {
    enrollmentId: "1234-5638",
    fullName: "João Vitor Mesquita da Frota",
    course: "E.S.",
    period: 5,
    lastAppointment: "10/03/2026",
    activeNeed: "TDAH TAG",
  },
  {
    enrollmentId: "1234-7985",
    fullName: "David Yan dos Santos Prado",
    course: "C.C.",
    period: 3,
    lastAppointment: "17/02/2026",
    activeNeed: "TEA",
  },
  {
    enrollmentId: "1234-3456",
    fullName: "Lucas Eduardo Souza de Moura",
    course: "A.B.I.",
    period: 7,
    lastAppointment: "04/01/2026",
    activeNeed: "PCD",
  },
  {
    enrollmentId: "1234-7423",
    fullName: "Maria Eduarda Costa Lyra do Nascimento",
    course: "S.I.",
    period: 1,
    lastAppointment: "10/02/2026",
    activeNeed: "Dificuldade de aprendizado",
  },
  {
    enrollmentId: "1234-6914",
    fullName: "Thiago Vinícius Costa Guimarães",
    course: "Outros",
    period: 9,
    lastAppointment: "11/03/2026",
    activeNeed: "Nenhuma",
  },
  {
    enrollmentId: "1234-5678",
    fullName: "João Vitor Mesquita da Frota",
    course: "E.S.",
    period: 5,
    lastAppointment: "10/03/2026",
    activeNeed: "TDAH TAG",
  },
  {
    enrollmentId: "1234-7925",
    fullName: "David Yan dos Santos Prado",
    course: "C.C.",
    period: 3,
    lastAppointment: "17/02/2026",
    activeNeed: "TEA",
  },
  {
    enrollmentId: "1234-3436",
    fullName: "Lucas Eduardo Souza de Moura",
    course: "A.B.I.",
    period: 7,
    lastAppointment: "04/01/2026",
    activeNeed: "PCD",
  },
  {
    enrollmentId: "1234-7453",
    fullName: "Maria Eduarda Costa Lyra do Nascimento",
    course: "S.I.",
    period: 1,
    lastAppointment: "10/02/2026",
    activeNeed: "Dificuldade de aprendizado",
  },
  {
    enrollmentId: "1234-6954",
    fullName: "Thiago Vinícius Costa Guimarães",
    course: "Outros",
    period: 9,
    lastAppointment: "11/03/2026",
    activeNeed: "Nenhuma",
  },
];

export default function StudentDatabase() {
  const [students] = useState<Student[]>(INITIAL_STUDENTS);

  return (
    <div className="px-8 py-7 flex-1">
      <div className="bg-white rounded-2xl border border-[#ece7db] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h1 className="m-0 text-xl font-semibold text-[#3a3530]">
            Lista Geral de Alunos
          </h1>
          <button className="flex items-center gap-1.5 bg-[#6bc4a6] hover:bg-[#52b594] text-white border-none rounded-[10px] px-4.5 py-2.5 text-[13px] font-bold cursor-pointer transition-colors duration-150">
            <Plus size={18} />
            Adicionar Novo Aluno
          </button>
        </div>

        <StudentTable students={INITIAL_STUDENTS} />

        <div className="px-6 py-3 border-t border-[#f0ebe0] text-[#a0a098] text-xs">
          {INITIAL_STUDENTS.length} aluno
          {INITIAL_STUDENTS.length !== 1 ? "s" : ""} encontrado
          {INITIAL_STUDENTS.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
