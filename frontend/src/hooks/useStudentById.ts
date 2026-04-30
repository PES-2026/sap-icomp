import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { studentService } from "@/services";
import { Student } from "@/types/student";
import { formatGetStudentForFrontend } from "@/utils/studentFormUtils";

export const useStudentById = (id: string) => {
  const [student, setStudent] = useState<Student>();
  const [isLoadingStudent, setIsLoadingStudent] = useState(true);

  useEffect(() => {
    const fetchStudentById = async () => {
      try {
        setIsLoadingStudent(true);
        const data = await studentService.getStudentById(id);
        setStudent(formatGetStudentForFrontend(data));
      } catch (error) {
        console.error("Error loading student:", error);
        toast.error("Não foi possível carregar o aluno.");
      } finally {
        setIsLoadingStudent(false);
      }
    };

    fetchStudentById();
  }, []);

  return { student, isLoadingStudent };
};
