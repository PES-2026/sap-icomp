"use client";

import CommonButton from "@/components/ui/CommonButton";
import { Column, DataTable } from "@/components/ui/DataTable";
import { SelectInput } from "@/components/ui/FilterSelect";
import { NeedBadge } from "@/components/ui/NeedBadge";
import { SearchInput } from "@/components/ui/SearchInput";
import { PATHS } from "@/constants/paths";
import { useCoursesOptions } from "@/features/courses/hooks/useCoursesOptions";
import { useAppNavigation } from "@/utils/navigator";
import { Edit, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useStudents } from "../../hooks/useStudents";
import { Student } from "../../types/student";
import { StudentSkeletonTable } from "./StudentSkeletonTable";

export default function StudentTable() {
  const { handleNavigation } = useAppNavigation();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { students, isLoading } = useStudents(page, limit);
  const { coursesOptions } = useCoursesOptions();

  const [enrollmentFilter, setEnrollmentFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [dignosesFilter, setDiagnosesFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("Todos");

  const filteredStudents = students.filter((student) => {
    const matchEnrollment = (student.enrollmentId || "")
      .toLowerCase()
      .includes(enrollmentFilter.toLowerCase());
    const matchName = (student.name || "")
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const matchNeed =
      student.diagnoses.length > 0
        ? student.diagnoses.some(
            (diag) =>
              (diag.name || "")
                .toLowerCase()
                .includes(dignosesFilter.toLowerCase()) ||
              (diag.acronym || "")
                .toLowerCase()
                .includes(dignosesFilter.toLowerCase()),
          )
        : true;
    const matchCourse =
      courseFilter === "Todos" ||
      (student.course?.id ?? "")
        .toLowerCase()
        .includes(courseFilter.toLowerCase());
    console.log(matchEnrollment, matchName, matchNeed, matchCourse);
    return matchEnrollment && matchName && matchNeed && matchCourse;
  });

  const columns: Column<Student>[] = [
    {
      label: "Matrícula",
      width: "w-[160px]",
      renderFilter: () => (
        <SearchInput value={enrollmentFilter} onChange={setEnrollmentFilter} />
      ),
      renderCell: (student) => (
        <span className="font-semibold text-[#4a4540]">
          {student.enrollmentId}
        </span>
      ),
    },
    {
      label: "Nome Completo",
      width: "w-[600px]",
      renderFilter: () => (
        <SearchInput value={nameFilter} onChange={setNameFilter} />
      ),
      renderCell: (student) => (
        <span className="font-medium text-[#3a3530]">{student.name}</span>
      ),
    },
    {
      label: "Curso",
      width: "w-[300px]",
      renderFilter: () => (
        <SelectInput
          value={courseFilter}
          onChange={setCourseFilter}
          options={coursesOptions}
          placeholder="Todos"
          // isSetLabel={true}
        />
      ),
      renderCell: (student) => student.course?.name || "Não informado",
    },
    {
      label: "Necessidade Ativa",
      width: "w-[160px]",
      renderFilter: () => (
        <SearchInput value={dignosesFilter} onChange={setDiagnosesFilter} />
      ),
      renderCell: (student) =>
        student.diagnoses && student.diagnoses.length > 0 ? (
          <div className="flex flex-wrap gap-1 justify-center">
            {student.diagnoses.map((diag) => (
              <NeedBadge key={diag.id} value={diag.acronym || diag.name} />
            ))}
          </div>
        ) : (
          <span className="text-gray-400">Nenhum diagnóstico</span>
        ),
    },
    {
      label: "Último Atendimento",
      width: "w-[140px]",
      renderCell: () => "-",
    },
    {
      label: "",
      width: "w-[70px]",
      renderCell: (student) => (
        <div className="flex justify-center gap-0.5">
          <Link
            href={PATHS.visualize_student(student.id)}
            className="flex items-center rounded-md p-1 text-[#6bc4a6] hover:bg-[#e8f7f2]"
          >
            <Eye size={20} />
          </Link>
          <Link
            href={PATHS.edit_student(student.id)}
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
      title="Lista Geral de Alunos"
      isLoading={isLoading}
      loadingComponent={<StudentSkeletonTable />}
      data={filteredStudents}
      columns={columns}
      page={page}
      setPage={setPage}
      limit={limit}
      setLimit={setLimit}
      totalItems={students.length}
      emptyMessage="Nenhum aluno encontrado."
      headerAction={
        <CommonButton
          label="Adicionar Novo Aluno"
          startIcon={Plus}
          onClick={() => handleNavigation({ path: PATHS.register_student })}
        />
      }
    />
  );
}
