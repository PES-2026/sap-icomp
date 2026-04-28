import { useState, useEffect } from "react";
import { SelectOption } from "@/types/selectOption";
import { coursesService } from "@/services/selectOptions";
import toast from "react-hot-toast";

export const useCoursesOptions = () => {
  const [coursesOptions, setCoursesOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await coursesService.get();

        const mappedOptions: SelectOption[] = response.map((course) => ({
          value: String(course.id),
          label: course.name,
        }));

        setCoursesOptions(mappedOptions);
      } catch (err) {
        console.error("Error to fetch courses: ", err);
        toast.error("Não foi possível carregar as opções de cursos.");
      }
    };

    fetchCourses();
  }, []);

  return { coursesOptions };
};
