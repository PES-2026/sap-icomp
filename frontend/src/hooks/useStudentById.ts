import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { studentService } from "@/services";
import { Student } from "@/types/student";

export const useStudentById = (id: string) => {
  const [student, setStudent] = useState<Student>();

  useEffect(() => {
    const fetchStudentById = async () => {
      try {
        const data = await studentService.getStudentById(id);
        setStudent(data);
      } catch (error) {
        console.error("Error loading student:", error);
        toast.error("Não foi possível carregar o aluno.");
      }
    };

    fetchStudentById();
  }, []);

  return { student };
};
