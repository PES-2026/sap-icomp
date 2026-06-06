"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useAuthStore } from "@/store/authStore";
import { scheduleMock } from "../services/scheduleMock";
import { scheduleService } from "../services/scheduleService";
import {
  ScheduleFormData,
  SchedulePreviewPayload,
  ScheduleSlot,
} from "../types/schedule";
import {
  minutesToDuration,
  scheduleSchema,
} from "../utils/validations";

export const SCHEDULE_PREVIEW_MOCK_ENABLED =
  process.env.NEXT_PUBLIC_SCHEDULE_PREVIEW_MOCK !== "false";

export const useSchedulePreview = () => {
  const pedagogueId = useAuthStore((state) => state.user?.id);
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [disabledSlotIds, setDisabledSlotIds] = useState<Set<string>>(
    new Set(),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasGeneratedPreview, setHasGeneratedPreview] = useState(false);

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      durationMinutes: "50",
    },
  });

  const generatePreview = async (data: ScheduleFormData) => {
    if (!pedagogueId) {
      toast.error("Não foi possível identificar a pedagoga.");
      return;
    }

    const payload: SchedulePreviewPayload = {
      pedagogueId,
      startDate: data.startDate,
      endDate: data.endDate,
      startTime: data.startTime,
      endTime: data.endTime,
      appointmentDuration: minutesToDuration(Number(data.durationMinutes)),
    };

    try {
      setIsLoading(true);

      const response = SCHEDULE_PREVIEW_MOCK_ENABLED
        ? await scheduleMock.preview(payload)
        : await scheduleService.preview(payload);

      setSlots(response.slots);
      setDisabledSlotIds(new Set());
      setHasGeneratedPreview(true);

      if (response.slots.length === 0) {
        toast.error(
          "Nenhum horário completo cabe no período informado.",
        );
      } else {
        toast.success("Prévia da agenda gerada com sucesso.");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível gerar a prévia da agenda.";

      toast.error(message);
      setSlots([]);
      setDisabledSlotIds(new Set());
      setHasGeneratedPreview(false);
    } finally {
      setIsLoading(false);
    }
  };

  const clearPreview = () => {
    form.reset();
    setSlots([]);
    setDisabledSlotIds(new Set());
    setHasGeneratedPreview(false);
  };

  const invalidatePreview = () => {
    if (!hasGeneratedPreview) return;

    setSlots([]);
    setDisabledSlotIds(new Set());
    setHasGeneratedPreview(false);
  };

  const toggleSlot = (slotId: string) => {
    setDisabledSlotIds((current) => {
      const next = new Set(current);

      if (next.has(slotId)) {
        next.delete(slotId);
      } else {
        next.add(slotId);
      }

      return next;
    });
  };

  const confirmPreview = () => {
    const activeSlots = slots.length - disabledSlotIds.size;

    toast.success(
      `${activeSlots} ${activeSlots === 1 ? "horário selecionado" : "horários selecionados"}. O salvamento será habilitado quando o backend estiver disponível.`,
    );
  };

  return {
    form,
    slots,
    disabledSlotIds,
    isLoading,
    hasGeneratedPreview,
    isMockMode: SCHEDULE_PREVIEW_MOCK_ENABLED,
    clearPreview,
    invalidatePreview,
    toggleSlot,
    confirmPreview,
    onSubmit: form.handleSubmit(generatePreview),
  };
};
