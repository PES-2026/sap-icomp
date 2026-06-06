"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  AppointmentFormData,
  appointmentSchema,
} from "../schemas/appointmentSchema";
import { appointmentService } from "../services/appointmentService";
import { TimeSlot } from "../types/appointment";

export const useAppointmentForm = () => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const methods = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      studentName: "",
      email: "",
      registrationNumber: "",
      pedagogueId: "",
      date: "",
      courseId: "",
      slotId: "",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const date = watch("date");
  const pedagogueId = watch("pedagogueId");
  const selectedSlotId = watch("slotId");

  useEffect(() => {
    const fetchSlots = async () => {
      if (!date || !pedagogueId) {
        setSlots([]);
        return;
      }

      setIsLoadingSlots(true);
      try {
        const data = await appointmentService.getSlots(date, pedagogueId);
        setSlots(data);
      } catch (error) {
        setSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [date, pedagogueId]);

  const handleSelectSlot = (id: string) => {
    setValue("slotId", selectedSlotId === id ? "" : id, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      console.log(data);
      await appointmentService.create(data);
      toast.success("Atendimento solicitado com sucesso!");
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    register,
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    slots,
    isLoadingSlots,
    isSubmitting,
    selectedSlotId,
    handleSelectSlot,
  };
};
