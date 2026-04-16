"use client";

import { Edit, Eye, Plus } from "lucide-react";
import { SearchInput } from "../search-input/SearchInput";
import { useEffect, useState } from "react";
import { SelectInput } from "../select-input/FilterSelect";
import CommonButton from "../common-button/CommonButton";
import Link from "next/link";
import { useAppNavigation } from "@/utils/navigator";
import { NewStudent } from "@/types/student";
import { NeedBadge } from "../need-badge/NeedBadge";
import { COURSES_ACRONYM } from "@/constants/courses";
import { studentService } from "@/services";
import { PATHS } from "@/constants/paths";

export default function StudentTable() {
  const { handleNavigation } = useAppNavigation();

  const [students, setStudents] = useState<NewStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [enrollmentFilter, setEnrollmentFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("Todos");
  const [periodFilter, setPeriodFilter] = useState("Todos");
  const [appointmentFilter, setAppointmentFilter] = useState("");
  const [needFilter, setNeedFilter] = useState("");

  const periods = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const data = await studentService.getStudents();
        setStudents(data);
        console.log(students);
      } catch (error) {
        console.error("Erro ao carregar a lista de alunos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchEnrollment = student.enrollmentId
      .toLowerCase()
      .includes(enrollmentFilter.toLowerCase());
    const matchName = student.name
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const matchCourse =
      courseFilter === "Todos" || student.courseId === courseFilter;
    const matchNeed = (student.diagnosis ?? "")
      .toLowerCase()
      .includes(needFilter.toLowerCase());

    return matchEnrollment && matchName && matchCourse && matchNeed;
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
    <main className="flex min-w-0 flex-1 flex-col h-full font-sans p-7">
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-[#faf7f0] border border-[#ece7db] shadow-[0_2px_12px_rgba(0,0,0,0.04)] min-h-0">
        <div className="flex shrink-0 items-center justify-between px-6 pb-4 pt-5">
          <h1 className="m-0 text-xl font-semibold text-[#3a3530]">
            Lista Geral de Alunos
          </h1>
          <CommonButton
            label="Adicionar Novo Aluno"
            startIcon={Plus}
            onClick={() => handleNavigation({ path: PATHS.register_student })}
          />
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead className="sticky top-0 z-10">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={`whitespace-nowrap border-y border-[#ece7db] bg-[#faf7f0] px-4 py-3 text-center font-bold text-[#4a4540] ${col.width}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>

              <tr>
                <td className="border-b border-[#ece7db] bg-[#faf7f0] px-4 py-2">
                  <SearchInput
                    value={enrollmentFilter}
                    onChange={setEnrollmentFilter}
                  />
                </td>
                <td className="border-b border-[#ece7db] bg-[#faf7f0] px-4 py-2">
                  <SearchInput value={nameFilter} onChange={setNameFilter} />
                </td>
                <td className="border-b border-[#ece7db] bg-[#faf7f0] px-4 py-2">
                  <SelectInput
                    value={courseFilter}
                    onChange={setCourseFilter}
                    options={COURSES_ACRONYM}
                    defaultOption="Todos"
                  />
                </td>
                <td className="border-b border-[#ece7db] bg-[#faf7f0] px-4 py-2">
                  <SelectInput
                    value={periodFilter}
                    onChange={setPeriodFilter}
                    options={periods}
                    defaultOption="Todos"
                  />
                </td>
                <td className="border-b border-[#ece7db] bg-[#faf7f0] px-4 py-2">
                  <SearchInput
                    value={appointmentFilter}
                    onChange={setAppointmentFilter}
                  />
                </td>
                <td className="border-b border-[#ece7db] bg-[#faf7f0] px-4 py-2">
                  <SearchInput value={needFilter} onChange={setNeedFilter} />
                </td>
                <td className="border-b border-[#ece7db] bg-[#faf7f0] px-4 py-2" />
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-[#a0a0a0]"
                  >
                    Nenhum aluno encontrado.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => {
                  const isLast = idx === filteredStudents.length - 1;
                  const borderClass = isLast ? "" : "border-b border-[#f0ebe0]";

                  return (
                    <tr
                      key={student.enrollmentId}
                      className="transition-colors duration-150 bg-white hover:bg-[#fcfcfc]"
                    >
                      <td
                        className={`px-4 py-3.5 text-center font-semibold text-[#4a4540] ${borderClass}`}
                      >
                        {student.enrollmentId}
                      </td>
                      <td
                        className={`px-4 py-3.5 text-center font-medium text-[#3a3530] ${borderClass}`}
                      >
                        {student.name}
                      </td>
                      <td
                        className={`px-4 py-3.5 text-center text-[#6a6560] ${borderClass}`}
                      >
                        {student.courseId}
                      </td>
                      <td
                        className={`px-4 py-3.5 text-center text-[#6a6560] ${borderClass}`}
                      >
                        -
                      </td>
                      <td
                        className={`px-4 py-3.5 text-center text-[#6a6560] ${borderClass}`}
                      >
                        -
                      </td>
                      <td className={`px-4 py-3.5 text-center ${borderClass}`}>
                        {student.diagnosis ? (
                          <NeedBadge value={student.diagnosis} />
                        ) : (
                          <span className="text-[#6a6560]">
                            Nenhum diagnóstico
                          </span>
                        )}
                      </td>
                      <td className={`px-4 py-3.5 ${borderClass}`}>
                        <div className="flex gap-2">
                          <Link
                            href={PATHS.visualize_student(student.enrollmentId)}
                            title="Visualizar"
                            className="flex items-center rounded-md p-1 text-[#6bc4a6] transition-colors duration-150 hover:bg-[#e8f7f2]"
                          >
                            <Eye size={20} />
                          </Link>
                          <Link
                            href={PATHS.edit_student(student.enrollmentId)}
                            title="Editar"
                            className="flex items-center rounded-md p-1 text-[#b0a898] transition-colors duration-150 hover:bg-[#f0ebe0]"
                          >
                            <Edit size={20} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="shrink-0 border-t border-[#f0ebe0] px-6 py-3 text-sm text-[#a0a098]">
          {!isLoading && (
            <>
              {filteredStudents.length} aluno
              {filteredStudents.length !== 1 ? "s" : ""} encontrado
              {filteredStudents.length !== 1 ? "s" : ""}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
