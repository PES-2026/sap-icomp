"use client";

import { Column, DataTable } from "@/components/ui/DataTable";
import { SelectInput } from "@/components/ui/FilterSelect";
import { SearchInput } from "@/components/ui/SearchInput";
import { PATHS } from "@/constants/paths";
import { useCoursesOptions } from "@/features/courses/hooks/useCoursesOptions";
import { Edit, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAttendanceTypesOptions } from "../../hooks/useAttendanceTypesOptions";
import { useAttendances } from "../../hooks/useAttendances";
import { Attendance } from "../../types/attendance";

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

  const columns: Column<Attendance>[] = [
    {
      label: "Matrícula",
      width: "w-[120px]",
      renderFilter: () => (
        <SearchInput value={enrollmentFilter} onChange={setEnrollmentFilter} />
      ),
      renderCell: (attendance) => (
        <span className="font-semibold text-[#4a4540]">
          {attendance.enrollmentId}
        </span>
      ),
    },
    {
      label: "Nome Completo",
      width: "w-[500px]",
      renderFilter: () => (
        <SearchInput value={nameFilter} onChange={setNameFilter} />
      ),
      renderCell: (attendance) => (
        <span className="font-medium text-[#3a3530]">
          {attendance.studentName}
        </span>
      ),
    },
    {
      label: "Curso",
      width: "w-[300px]",
      renderFilter: () => (
        <SelectInput
          value={courseIdFilter}
          onChange={setCourseIdFilter}
          options={coursesOptions}
          placeholder="Todos"
        />
      ),
      renderCell: (attendance) => attendance.course,
    },
    {
      label: "Período",
      width: "w-[70px]",
      renderFilter: () => (
        <SelectInput
          value={periodFilter}
          onChange={setPeriodFilter}
          options={periods}
          placeholder="Todos"
        />
      ),
      renderCell: (attendance) => attendance.period || "-",
    },
    {
      label: "Tipo de Atendimento",
      width: "w-[140px]",
      renderFilter: () => (
        <SelectInput
          value={attendanceTypeIdFilter}
          onChange={setAttendanceTypeIdFilter}
          options={attendanceTypesOptions}
          placeholder="Todos"
        />
      ),
      renderCell: (attendance) => attendance.attendanceType,
    },
    {
      label: "Data do Atendimento",
      width: "w-[160px]",
      renderFilter: () => (
        <SearchInput
          value={attendanceDateFilter}
          onChange={setAttendanceDateFilter}
        />
      ),
      renderCell: (attendance) => attendance.attendanceDate,
    },
    {
      label: "",
      width: "w-[50px]",
      renderCell: (attendance) => (
        <div className="flex justify-center gap-0.5">
          <Link
            aria-label="Visualizar Atendimento"
            title="Visualizar"
            href={PATHS.visualize_attendance(
              attendance.studentId,
              attendance.attendanceId,
            )}
            className="flex items-center rounded-md p-1 text-[#6bc4a6] hover:bg-[#e8f7f2]"
          >
            <Eye size={20} />
          </Link>
          <Link
            aria-label="Editar Atendimento"
            title="Editar"
            href={PATHS.edit_attendance(
              attendance.studentId,
              attendance.attendanceId,
            )}
            className="flex items-center rounded-md p-1 text-[#b0a898] hover:bg-[#f0ebe0]"
          >
            <Edit size={20} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title="Lista de Atendimentos"
      isLoading={isLoadingAttendances}
      data={filteredAttendances}
      columns={columns}
      page={page}
      setPage={setPage}
      limit={limit}
      setLimit={setLimit}
      totalItems={attendances.length}
      emptyMessage="Nenhum atendimento encontrado."
    />
  );
}
