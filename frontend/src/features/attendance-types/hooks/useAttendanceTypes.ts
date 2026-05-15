"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { attendanceTypeService } from "../services/attendanceTypeService";
import { AttendanceType } from "../types/attendanceType";

export function useAttendanceTypes() {
  const [attendanceTypes, setAttendanceTypes] = useState<AttendanceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTypes = async () => {
    setIsLoading(true);
    try {
      const response = await attendanceTypeService.getAll(1, 100);
      setAttendanceTypes(response.items || []);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const getTypeById = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await attendanceTypeService.getById(id);
      return response;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createType = async (name: string) => {
    try {
      await attendanceTypeService.create({ name });
      toast.success("Tipo de atendimento criado com sucesso!");
      await fetchTypes();
      return true;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      return false;
    }
  };

  const updateType = async (id: string, name: string) => {
    try {
      await attendanceTypeService.update(id, { name });
      toast.success("Tipo de atendimento atualizado!");
      await fetchTypes();
      return true;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      return false;
    }
  };

  const removeType = async (id: string) => {
    try {
      await attendanceTypeService.remove(id);
      toast.success("Tipo de atendimento removido.");
      await fetchTypes();
      return true;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      return false;
    }
  };

  return {
    attendanceTypes,
    isLoading,
    fetchTypes,
    getTypeById,
    createType,
    updateType,
    removeType,
  };
}
