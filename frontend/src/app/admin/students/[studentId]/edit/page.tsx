"use client";

import StudentForm from "@/components/forms/StudentForm";
import { PATHS } from "@/constants/paths";
import { studentService } from "@/services";
import { StudentFormData } from "@/types/student";
import { useAppNavigation } from "@/utils/navigator";
import { formatForFrontend } from "@/utils/studentFormUtils";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditStudentPage() {
  const params = useParams();
  const id = decodeURIComponent((params?.studentId as string) ?? "");
  const { handleNavigation } = useAppNavigation();

  const [studentData, setStudentData] = useState<StudentFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return;

      try {
        setIsLoading(true);

        const allStudents = await studentService.getStudents();

        const foundStudent = allStudents.find((s) => s.externalId === id);

        if (foundStudent) {
          const formattedData = formatForFrontend(foundStudent);
          setStudentData(formattedData);
        } else {
          console.error("Student not found.");
          handleNavigation({ path: "/admin/students" });
        }
      } catch (error) {
        console.error("Error to fetch data student: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-7">
        <div className="flex flex-col items-center gap-3 text-[#6a6560]">
          <Loader2 className="animate-spin text-[#6bc4a6]" size={32} />
          <p>Carregando dados do aluno...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex h-full w-full items-center justify-center p-7">
        <p className="text-[#a0a0a0]">Aluno não encontrado no sistema.</p>
      </div>
    );
  }

  return (
    <StudentForm
      initialData={studentData}
      onCancel={() => handleNavigation({ path: PATHS.students_list })}
    />
  );
}
