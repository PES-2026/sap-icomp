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
  timeToMinutes,
} from "../utils/validations";

export const SCHEDULE_PREVIEW_MOCK_ENABLED =
  process.env.NEXT_PUBLIC_SCHEDULE_PREVIEW_MOCK === "true";

interface ManualSlotData {
  date: string;
  startTime: string;
  endTime: string;
}

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const getSlotId = (slot: ScheduleSlot) =>
  `${slot.startDateTime}|${slot.endDateTime}`;

const getDateFromDateTime = (dateTime: string) => dateTime.slice(0, 10);

const getTimeFromDateTime = (dateTime: string) => dateTime.slice(11, 16);

const sortSlotsByStart = (slots: ScheduleSlot[]) =>
  [...slots].sort((a, b) => a.startDateTime.localeCompare(b.startDateTime));

export const useSchedulePreview = () => {
  const pedagogueId = useAuthStore((state) => state.user?.id);
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [disabledSlotIds, setDisabledSlotIds] = useState<Set<string>>(
    new Set(),
  );
  const [previewPayload, setPreviewPayload] =
    useState<SchedulePreviewPayload | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
      attendanceDuration: minutesToDuration(Number(data.durationMinutes)),
    };

    try {
      setIsLoading(true);

      const response = SCHEDULE_PREVIEW_MOCK_ENABLED
        ? await scheduleMock.preview(payload)
        : await scheduleService.preview(payload);

      setSlots(response.slots);
      setDisabledSlotIds(new Set());
      setPreviewPayload(payload);
      setHasGeneratedPreview(true);

      if (response.slots.length === 0) {
        toast.error("Nenhum horário completo cabe no período informado.");
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
      setPreviewPayload(null);
      setHasGeneratedPreview(false);
    } finally {
      setIsLoading(false);
    }
  };

  const clearPreview = () => {
    form.reset();
    setSlots([]);
    setDisabledSlotIds(new Set());
    setPreviewPayload(null);
    setIsConfirmOpen(false);
    setHasGeneratedPreview(false);
  };

  const invalidatePreview = () => {
    if (!hasGeneratedPreview) return;

    setSlots([]);
    setDisabledSlotIds(new Set());
    setPreviewPayload(null);
    setIsConfirmOpen(false);
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

  const getActiveSlots = () =>
    slots.filter((slot) => !disabledSlotIds.has(getSlotId(slot)));

  const addManualSlot = ({ date, startTime, endTime }: ManualSlotData) => {
    if (!previewPayload) {
      toast.error("Gere a prévia antes de adicionar horários manuais.");
      return false;
    }

    if (
      !DATE_PATTERN.test(date) ||
      !TIME_PATTERN.test(startTime) ||
      !TIME_PATTERN.test(endTime)
    ) {
      toast.error("Informe data, horário inicial e horário final válidos.");
      return false;
    }

    if (date < previewPayload.startDate || date > previewPayload.endDate) {
      toast.error("Inclua um horário dentro do período da agenda.");
      return false;
    }

    if (
      timeToMinutes(startTime) < timeToMinutes(previewPayload.startTime) ||
      timeToMinutes(endTime) > timeToMinutes(previewPayload.endTime)
    ) {
      toast.error("Inclua um horário dentro do período da agenda.");
      return false;
    }

    if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
      toast.error(
        "O horário de término deve ser posterior ao horário de início.",
      );
      return false;
    }

    const newSlot: ScheduleSlot = {
      startDateTime: `${date}T${startTime}:00`,
      endDateTime: `${date}T${endTime}:00`,
    };

    const alreadyExists = slots.some(
      (slot) =>
        slot.startDateTime === newSlot.startDateTime &&
        slot.endDateTime === newSlot.endDateTime,
    );

    if (alreadyExists) {
      toast.error("Este horário já está na prévia.");
      return false;
    }

    const newStartMinutes = timeToMinutes(startTime);
    const newEndMinutes = timeToMinutes(endTime);
    const hasOverlap = getActiveSlots().some((slot) => {
      if (getDateFromDateTime(slot.startDateTime) !== date) return false;

      const slotStartMinutes = timeToMinutes(
        getTimeFromDateTime(slot.startDateTime),
      );
      const slotEndMinutes = timeToMinutes(
        getTimeFromDateTime(slot.endDateTime),
      );

      return (
        newStartMinutes < slotEndMinutes && newEndMinutes > slotStartMinutes
      );
    });

    if (hasOverlap) {
      toast.error("O horário manual se sobrepõe a outro horário ativo.");
      return false;
    }

    setSlots((currentSlots) => sortSlotsByStart([...currentSlots, newSlot]));
    toast.success("Horário manual adicionado à prévia.");
    return true;
  };

  const confirmPreview = () => {
    if (!previewPayload) {
      toast.error("Gere a prévia antes de salvar a agenda.");
      return;
    }

    const activeSlots = getActiveSlots();

    if (activeSlots.length === 0) {
      toast.error("Selecione pelo menos um horário para salvar.");
      return;
    }

    setIsConfirmOpen(true);
  };

  const cancelSaveConfirmation = () => {
    if (isSaving) return;

    setIsConfirmOpen(false);
  };

  const saveSchedule = async () => {
    if (!previewPayload) {
      toast.error("Gere a prévia antes de salvar a agenda.");
      return;
    }

    const activeSlots = getActiveSlots();

    if (activeSlots.length === 0) {
      toast.error("Selecione pelo menos um horário para salvar.");
      return;
    }

    try {
      setIsSaving(true);

      if (SCHEDULE_PREVIEW_MOCK_ENABLED) {
        await scheduleMock.save({
          ...previewPayload,
          slots: activeSlots,
        });
      } else {
        await scheduleService.save({
          ...previewPayload,
          slots: activeSlots,
        });
      }

      toast.success("Agenda salva com sucesso.");
      setIsConfirmOpen(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a agenda.";

      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const activeSlotsCount = getActiveSlots().length;

  return {
    form,
    slots,
    previewPayload,
    disabledSlotIds,
    isLoading,
    isSaving,
    isConfirmOpen,
    hasGeneratedPreview,
    activeSlotsCount,
    isMockMode: SCHEDULE_PREVIEW_MOCK_ENABLED,
    clearPreview,
    invalidatePreview,
    toggleSlot,
    addManualSlot,
    confirmPreview,
    cancelSaveConfirmation,
    saveSchedule,
    onSubmit: form.handleSubmit(generatePreview),
  };
};
