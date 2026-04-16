import StudentTable, { Student } from "@/components/tables/StudentTable";

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
  return <StudentTable students={INITIAL_STUDENTS} />;
}
