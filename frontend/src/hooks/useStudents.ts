import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { studentService } from "@/services";
import { Student } from "@/types/student";

export const useStudents = (page: number, limit: number) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const data = await studentService.getStudents(page, limit);
        setStudents(data ?? []);
      } catch (error) {
        console.error("Error loading students list:", error);
        toast.error("Não foi possível carregar os atendimentos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [page, limit]);

  return { students, isLoading };
};
