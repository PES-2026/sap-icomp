"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { coursesService } from "../services/courseService";
import { Course, CoursePayload } from "../types/course";

export function useCoursesSettings(autoFetch = true) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCourses = async () => {
    setIsLoading(true);

    try {
      const response = await coursesService.getAllCourses(1, 100);

      setCourses(response.items || []);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!autoFetch) return;

    fetchCourses();
  }, []);

  const getCourseById = async (id: string) => {
    setIsLoading(true);

    try {
      return await coursesService.getById(id);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createCourse = async (data: CoursePayload) => {
    try {
      await coursesService.createCourse(data);
      toast.success("Curso cadastrado com sucesso!");
      await fetchCourses();
      return true;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      return false;
    }
  };

  const updateCourse = async (id: string, data: CoursePayload) => {
    try {
      await coursesService.updateCourse(id, data);
      toast.success("Curso atualizado com sucesso!");
      await fetchCourses();
      return true;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      return false;
    }
  };

  const removeCourse = async (id: string) => {
    try {
      await coursesService.removeCourse(id);
      toast.success("Curso excluído com sucesso do sistema");
      await fetchCourses();
      return true;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      return false;
    }
  };

  const orderedCourses = useMemo(() => {
    return [...courses].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }, [courses]);

  return {
    courses: orderedCourses,
    isLoading,
    fetchCourses,
    getCourseById,
    createCourse,
    updateCourse,
    removeCourse,
  };
}
