import { Edit, Eye, Filter } from "lucide-react";
import { SearchInput } from "../search_input/SearchInput";
import { useState } from "react";
import { SelectInput } from "../select_input/SelectInput";

export type SpecialNeed =
  | "TDAH TAG"
  | "TEA"
  | "PCD"
  | "Dificuldade de aprendizado"
  | "Nenhuma";

export type Course = "E.S." | "C.C." | "A.B.I." | "S.I." | "Outros";

const COURSES: Course[] = ["E.S.", "C.C.", "A.B.I.", "S.I.", "Outros"];

export interface Student {
  enrollmentId: string;
  fullName: string;
  course: Course;
  period: number;
  lastAppointment: string;
  activeNeed: SpecialNeed;
}

interface NeedBadgeProps {
  value: SpecialNeed;
}

const NeedBadge = ({ value }: NeedBadgeProps) => {
  const colorMap: Record<SpecialNeed, string> = {
    "TDAH TAG": "bg-[#fff3cd] text-[#856404]",
    TEA: "bg-[#d1ecf1] text-[#0c5460]",
    PCD: "bg-[#d4edda] text-[#155724]",
    "Dificuldade de aprendizado": "bg-[#f8d7da] text-[#721c24]",
    Nenhuma: "bg-[#e9ecef] text-[#495057]",
  };

  return (
    <span
      className={`inline-block rounded-md px-2 py-[3px] text-[11px] font-semibold whitespace-nowrap ${colorMap[value]}`}
    >
      {value}
    </span>
  );
};

export default function StudentTable({ students }: { students: Student[] }) {
  const [enrollmentFilter, setEnrollmentFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("Todos");
  const [periodFilter, setPeriodFilter] = useState("Todos");
  const [appointmentFilter, setAppointmentFilter] = useState("");
  const [needFilter, setNeedFilter] = useState("");

  const periods = ["Todos", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const filteredStudents = students.filter((student) => {
    const matchEnrollment = student.enrollmentId
      .toLowerCase()
      .includes(enrollmentFilter.toLowerCase());
    const matchName = student.fullName
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const matchCourse =
      courseFilter === "Todos" || student.course === courseFilter;
    const matchPeriod =
      periodFilter === "Todos" || student.period.toString() === periodFilter;
    const matchAppointment =
      student.lastAppointment.includes(appointmentFilter);
    const matchNeed = student.activeNeed
      .toLowerCase()
      .includes(needFilter.toLowerCase());

    return (
      matchEnrollment &&
      matchName &&
      matchCourse &&
      matchPeriod &&
      matchAppointment &&
      matchNeed
    );
  });

  const columns = [
    { label: "Matrícula", width: "w-[110px]" },
    { label: "Nome Completo", width: "w-[190px]" },
    { label: "Curso", width: "w-[70px]" },
    { label: "Período", width: "w-[70px]" },
    { label: "Último Atendimento", width: "w-[140px]" },
    { label: "Necessidade Ativa", width: "w-[160px]" },
    { label: "", width: "w-[70px]" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          {/* Column labels */}
          <tr className="border-y border-[#ece7db]">
            {columns.map((col, index) => (
              <th
                key={index}
                className={`px-4 py-3 text-center font-bold text-[#4a4540] bg-[#faf7f0] text-[12.5px] whitespace-nowrap ${col.width}`}
              >
                {col.label}
              </th>
            ))}
          </tr>

          {/* Filter row */}
          <tr className="border-b border-[#ece7db] bg-[#faf7f0]">
            <td className="px-4 py-2">
              <SearchInput
                value={enrollmentFilter}
                onChange={setEnrollmentFilter}
              />
            </td>
            <td className="px-4 py-2">
              <SearchInput value={nameFilter} onChange={setNameFilter} />
            </td>
            <td className="px-4 py-2">
              <SelectInput
                value={courseFilter}
                onChange={setCourseFilter}
                options={COURSES}
                defaultOption="Todos"
              />
            </td>
            <td className="px-4 py-2">
              <SelectInput
                value={periodFilter}
                onChange={setPeriodFilter}
                options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
                defaultOption="Todos"
              />
            </td>
            <td className="px-4 py-2">
              <SearchInput
                value={appointmentFilter}
                onChange={setAppointmentFilter}
              />
            </td>
            <td className="px-4 py-2">
              <SearchInput value={needFilter} onChange={setNeedFilter} />
            </td>
            <td />
          </tr>
        </thead>

        <tbody>
          {filteredStudents.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-[#a0a0a0]">
                Nenhum aluno encontrado.
              </td>
            </tr>
          ) : (
            filteredStudents.map((student, idx) => (
              <tr
                key={student.enrollmentId}
                className={`transition-colors duration-150 hover:bg-[#faf7f0] ${
                  idx < filteredStudents.length - 1
                    ? "border-b border-[#f0ebe0]"
                    : ""
                }`}
              >
                <td className="px-4 py-3.5 text-[#4a4540] font-semibold text-center">
                  {student.enrollmentId}
                </td>
                <td className="px-4 py-3.5 text-[#3a3530] font-medium text-center">
                  {student.fullName}
                </td>
                <td className="px-4 py-3.5 text-[#6a6560] text-center">
                  {student.course}
                </td>
                <td className="px-4 py-3.5 text-[#6a6560] text-center">
                  {student.period}º
                </td>
                <td className="px-4 py-3.5 text-[#6a6560] text-center">
                  {student.lastAppointment}
                </td>
                <td className="px-4 py-3.5 text-center">
                  <NeedBadge value={student.activeNeed} />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-2">
                    <button
                      title="Visualizar"
                      className="text-[#6bc4a6] p-1 rounded-md flex items-center transition-colors duration-150 hover:bg-[#e8f7f2]"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      title="Editar"
                      className="text-[#b0a898] p-1 rounded-md flex items-center transition-colors duration-150 hover:bg-[#f0ebe0]"
                    >
                      <Edit size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
