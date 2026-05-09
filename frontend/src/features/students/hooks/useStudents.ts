import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { studentService } from "../services/studentService";
import { Student } from "../types/student";
import { formatGetStudentForFrontend } from "../utils/studentUtils";

export const useStudents = (page: number, limit: number) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await studentService.getStudents(page, limit);
      const formattedStudents = data.map((d) => formatGetStudentForFrontend(d));
      setStudents(formattedStudents ?? []);
    } catch (error) {
      console.error("Error loading students list:", error);
      toast.error("Não foi possível carregar a lista de alunos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, limit]);

  return { students, isLoading, fetchStudents };
};
