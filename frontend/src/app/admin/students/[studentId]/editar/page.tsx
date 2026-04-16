"use client";

import StudentForm from "@/components/forms/StudentForm";
import { useAppNavigation } from "@/utils/navigator";
import { StudentFormData } from "@/types/student";
import { useParams } from "next/navigation";

const STUDENTS_DB: Record<string, StudentFormData> = {
  "1234-7985": {
    studentName: `David Yan dos Santos Prado`,
    registration: "1234-7985",
    birthDate: "15/04/1999",
    email: "carlos@gmail.com",
    phone: "(92) 98888-7777",
    course: "Sistemas de Informação",
    diagnosis: "TDAH",
    potentialities: "Excelente raciocínio lógico",
    demandsAndBarriers: "Dificuldade com prazos longos",
  },
  "1234-5638": {
    studentName: `João Vitor Mesquita da Frota`,
    registration: "1234-5638",
    birthDate: "15/04/1999",
    email: "carlos@gmail.com",
    phone: "(92) 98888-7777",
    course: "Sistemas de Informação",
    diagnosis: "TDAH",
    potentialities: "Excelente raciocínio lógico",
    demandsAndBarriers: "Dificuldade com prazos longos",
  },
};

export default function EditStudentPage() {
  const params = useParams();
  const id = decodeURIComponent((params?.studentId as string) ?? "");
  const { handleNavigation } = useAppNavigation();

  const student = STUDENTS_DB[id] ?? null;

  return (
    <StudentForm
      initialData={student}
      onSubmitSuccess={(updatedData) => {
        console.log(`Atualizando aluno ${id}:`, updatedData);
      }}
      onCancel={() => handleNavigation({ isBack: true })}
    />
  );
}
