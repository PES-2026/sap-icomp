"use client";

import { SelectInput } from "@/components/ui/FilterSelect";
import { SearchInput } from "@/components/ui/SearchInput";
import TablePagination from "@/components/ui/TablePagination";
import { PATHS } from "@/constants/paths";
import { useCoursesOptions } from "@/features/courses/hooks/useCoursesOptions";
import { Edit, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAttendanceTypesOptions } from "../../hooks/useAttendanceTypesOptions";
import { useAttendances } from "../../hooks/useAttendances";

const periods = [
  { value: "1", label: "1º" },
  { value: "2", label: "2º" },
  { value: "3", label: "3º" },
  { value: "4", label: "4º" },
  { value: "5", label: "5º" },
  { value: "6", label: "6º" },
  { value: "7", label: "7º" },
  { value: "8", label: "8º" },
  { value: "9", label: "9º" },
  { value: "10", label: "10º" },
];

export default function AttendanceTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { attendances, isLoadingAttendances, totalItems } = useAttendances(
    page,
    limit,
  );
  const { coursesOptions } = useCoursesOptions();
  const { attendanceTypesOptions } = useAttendanceTypesOptions();

  // Filters
  const [enrollmentFilter, setEnrollmentFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("Todos");
  const [attendanceDateFilter, setAttendanceDateFilter] = useState("");
  const [attendanceTypeIdFilter, setAttendanceTypeIdFilter] =
    useState<string>("");
  const [courseIdFilter, setCourseIdFilter] = useState<string>("");

  const filteredAttendances = attendances.filter((attendance) => {
    const matchEnrollment = attendance.enrollmentId
      .toLowerCase()
      .includes(enrollmentFilter.toLowerCase());
    const matchName = attendance.studentName
      .toLowerCase()
      .includes(nameFilter.toLowerCase());

    return matchEnrollment && matchName;
  });

  const columns = [
    { label: "Matrícula", width: "w-[120px]" },
    { label: "Nome Completo", width: "w-[500px]" },
    { label: "Curso", width: "w-[200px]" },
    { label: "Período", width: "w-[70px]" },
    { label: "Tipo de Atendimento", width: "w-[140px]" },
    { label: "Data do Atendimento", width: "w-[160px]" },
    { label: "", width: "w-[50px]" },
  ];

  return (
    !isLoadingAttendances && (
      <main className="flex min-w-0 flex-1 flex-col h-full font-sans p-7">
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-[#faf7f0] border border-[#ece7db] shadow-[0_2px_12px_rgba(0,0,0,0.04)] min-h-0">
          <div className="flex shrink-0 items-center justify-between px-6 pb-4 pt-5">
            <h1 className="m-0 text-xl font-semibold text-[#3a3530]">
              Atendimentos
            </h1>
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
                      value={courseIdFilter}
                      onChange={setCourseIdFilter}
                      options={coursesOptions}
                      placeholder="Todos"
                    />
                  </td>
                  <td className="border-b border-[#ece7db] bg-[#faf7f0] px-4 py-2">
                    <SelectInput
                      value={periodFilter}
                      onChange={setPeriodFilter}
                      options={periods}
                      placeholder="Todos"
                    />
                  </td>
                  <td className="border-b border-[#ece7db] bg-[#faf7f0] px-4 py-2">
                    <SelectInput
                      value={attendanceTypeIdFilter}
                      onChange={setAttendanceTypeIdFilter}
                      options={attendanceTypesOptions}
                      placeholder="Todos"
                    />
                  </td>
                  <td className="border-b border-[#ece7db] bg-[#faf7f0] px-4 py-2">
                    <SearchInput
                      value={attendanceDateFilter}
                      onChange={setAttendanceDateFilter}
                    />
                  </td>
                  <td className="border-b border-[#ece7db] bg-[#faf7f0] px-4 py-2" />
                </tr>
              </thead>

              <tbody>
                {filteredAttendances.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-[#a0a0a0]"
                    >
                      Nenhum aluno encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredAttendances.map((attendance, idx) => {
                    const isLast = idx === filteredAttendances.length - 1;
                    const borderClass = isLast
                      ? ""
                      : "border-b border-[#f0ebe0]";

                    return (
                      <tr
                        key={attendance.attendanceId}
                        className="transition-colors duration-150 bg-white hover:bg-[#fcfcfc]"
                      >
                        <td
                          className={`px-4 py-3.5 text-center font-semibold text-[#4a4540] ${borderClass}`}
                        >
                          {attendance.enrollmentId}
                        </td>
                        <td
                          className={`px-4 py-3.5 text-center font-medium text-[#3a3530] ${borderClass}`}
                        >
                          {attendance.studentName}
                        </td>
                        <td
                          className={`px-4 py-3.5 text-center text-[#6a6560] ${borderClass}`}
                        >
                          {attendance.course}
                        </td>
                        <td
                          className={`px-4 py-3.5 text-center text-[#6a6560] ${borderClass}`}
                        >
                          {attendance.period
                            ? attendance.period === "Formado"
                              ? "Formado(a)"
                              : attendance.period + "º"
                            : "-"}
                        </td>
                        <td
                          className={`px-4 py-3.5 text-center text-[#6a6560] ${borderClass}`}
                        >
                          {attendance.attendanceType}
                        </td>
                        <td
                          className={`px-4 py-3.5 text-[#6a6560] text-center ${borderClass}`}
                        >
                          {attendance.attendanceDate}
                        </td>
                        <td
                          className={`px-4 py-3.5 text-[#6a6560] ${borderClass}`}
                        >
                          <div className="flex gap-2">
                            <Link
                              href={PATHS.visualize_attendance(
                                attendance.studentId,
                                attendance.attendanceId,
                              )}
                              title="Visualizar"
                              className="flex items-center rounded-md p-1 text-[#6bc4a6] transition-colors duration-150 hover:bg-[#e8f7f2]"
                            >
                              <Eye size={20} />
                            </Link>
                            <Link
                              href={PATHS.edit_attendance(
                                attendance.studentId,
                                attendance.attendanceId,
                              )}
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
            lengthData={totalItems}
          />
        </div>
      </main>
    )
  );
}
