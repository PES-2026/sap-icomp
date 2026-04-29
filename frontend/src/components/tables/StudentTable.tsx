"use client";

import { Edit, Eye, Plus } from "lucide-react";
import { SearchInput } from "../search-input/SearchInput";
import { useState } from "react";
import { SelectInput } from "../select-input/FilterSelect";
import CommonButton from "../common-button/CommonButton";
import Link from "next/link";
import { useAppNavigation } from "@/utils/navigator";
import { NeedBadge } from "../need-badge/NeedBadge";
import { PATHS } from "@/constants/paths";
import { useCoursesOptions } from "@/hooks/useCoursesOptions";
import { useStudents } from "@/hooks/useStudents";
import TablePagination from "../table-pagination/TablePagination";

export default function StudentTable() {
  const { handleNavigation } = useAppNavigation();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { students, isLoading } = useStudents(page, limit);
  const { coursesOptions } = useCoursesOptions();

  const [enrollmentFilter, setEnrollmentFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("Todos");
  const [needFilter, setNeedFilter] = useState("");

  const filteredStudents = students.filter((student) => {
    const matchEnrollment = student.enrollmentId
      .toLowerCase()
      .includes(enrollmentFilter.toLowerCase());
    const matchName = student.name
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const matchNeed = (student.diagnosis ?? "")
      .toLowerCase()
      .includes(needFilter.toLowerCase());

    return matchEnrollment && matchName && matchNeed;
  });

  const columns = [
    { label: "Matrícula", width: "w-[160px]" },
    { label: "Nome Completo", width: "w-[600px]" },
    { label: "Curso", width: "w-[300px]" },
    { label: "Necessidade Ativa", width: "w-[160px]" },
    { label: "Último Atendimento", width: "w-[140px]" },
    { label: "", width: "w-[70px]" },
  ];

  return (
    !isLoading && (
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
                      options={coursesOptions}
                      placeholder="Todos"
                    />
                  </td>
                  <td className="border-b border-[#ece7db] bg-[#faf7f0] px-4 py-2">
                    <SearchInput value={needFilter} onChange={setNeedFilter} />
                  </td>
                  <td className="border-b border-[#ece7db] bg-[#faf7f0] px-4 py-2"></td>
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
                    const borderClass = isLast
                      ? ""
                      : "border-b border-[#f0ebe0]";

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
                          {student.course}
                        </td>
                        <td
                          className={`px-4 py-3.5 text-center ${borderClass}`}
                        >
                          {student.diagnosis ? (
                            <NeedBadge value={student.diagnosis} />
                          ) : (
                            <span className="text-[#6a6560]">
                              Nenhum diagnóstico
                            </span>
                          )}
                        </td>
                        <td
                          className={`px-4 py-3.5 text-center text-[#6a6560] ${borderClass}`}
                        >
                          -
                        </td>
                        <td className={`px-4 py-3.5 ${borderClass}`}>
                          <div className="flex gap-0.5">
                            <Link
                              href={PATHS.visualize_student(student.externalId)}
                              title="Visualizar"
                              className="flex items-center rounded-md p-1 text-[#6bc4a6] transition-colors duration-150 hover:bg-[#e8f7f2]"
                            >
                              <Eye size={20} />
                            </Link>
                            <Link
                              href={PATHS.edit_student(student.externalId)}
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

          <TablePagination
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            lengthData={students.length}
          />
        </div>
      </main>
    )
  );
}
