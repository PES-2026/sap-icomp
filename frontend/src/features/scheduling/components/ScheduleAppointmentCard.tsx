"use client";

import CommonButton from "@/components/ui/CommonButton";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { Field } from "@/components/ui/Field";
import { useCoursesOptions } from "@/features/courses/hooks/useCoursesOptions";
import { usePedagogueOptions } from "@/features/users/hooks/usePedagogueOptions";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";
import { useAppointmentForm } from "../hooks/useAppointmentForm";
import { AppointmentSlot } from "./AppointmentSlot";
import { CustomSelect } from "./CustomSelectNew";

export default function ScheduleAppointmentCard() {
  const {
    register,
    control,
    handleSubmit,
    errors,
    slots,
    isLoadingSlots,
    isSubmitting,
    selectedSlotId,
    handleSelectSlot,
  } = useAppointmentForm();

  const { coursesOptions } = useCoursesOptions();
  const { pedagogueOptions } = usePedagogueOptions();

  const validDatesForPedagogue = [
    "2026-06-15",
    "2026-06-16",
    "2026-06-25",
    "2026-07-02",
  ];

  const baseInputClass =
    "w-full px-3.5 py-2.5 border-[1.5px] rounded-md text-sm outline-none transition-colors font-sans text-stone-800";

  const getValidationClass = (hasError: boolean) =>
    hasError
      ? `${baseInputClass} border-red-400 text-red-900`
      : `${baseInputClass} bg-white border-stone-300 hover:border-stone-400 focus:border-teal-400 placeholder:text-stone-400`;

  return (
    <div className="flex min-w-0 flex-1 flex-col h-full font-sans bg-[#f5f0e8] p-4 sm:p-7 min-h-0">
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white border border-[#ece7db] shadow-[0_2px_12px_rgba(0,0,0,0.04)] min-h-0"
      >
        <div className="shrink-0 px-4 pt-5 pb-3 sm:px-7 sm:pt-7 sm:pb-4">
          <h1 className="m-0 text-xl sm:text-2xl text-center sm:text-left font-bold text-stone-800">
            Agendar atendimento
          </h1>
        </div>

        <div className="flex flex-col flex-1 px-4 sm:px-7 pb-4 overflow-y-auto gap-4">
          <div className="shrink-0 grid grid-cols-1 sm:grid-cols-10 gap-3.5 sm:gap-5">
            <div className="sm:col-span-4">
              <Field
                label="Aluno(a):"
                error={errors.studentName?.message}
                required
              >
                <input
                  type="text"
                  placeholder="Insira seu nome"
                  {...register("studentName")}
                  className={getValidationClass(!!errors.studentName)}
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field
                label="Matrícula:"
                error={errors.registrationNumber?.message}
                required
              >
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Insira sua matrícula"
                  {...register("registrationNumber")}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /\D/g,
                      "",
                    );
                  }}
                  className={getValidationClass(!!errors.registrationNumber)}
                />
              </Field>
            </div>

            <div className="sm:col-span-4">
              <Field label="Email:" error={errors.email?.message} required>
                <input
                  type="email"
                  placeholder="Insira seu e-mail"
                  {...register("email")}
                  className={getValidationClass(!!errors.email)}
                />
              </Field>
            </div>
          </div>

          <div className="shrink-0 grid grid-cols-1 sm:grid-cols-10 gap-3.5 sm:gap-5">
            <div className="sm:col-span-4">
              <Controller
                name="courseId"
                control={control}
                render={({
                  field: { onChange, onBlur, value, ref },
                  fieldState: { error },
                }) => (
                  <CustomSelect
                    ref={ref as any}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    label="Curso:"
                    error={error?.message}
                    options={coursesOptions}
                    required
                  />
                )}
              />
            </div>

            <div className="sm:col-span-4">
              <Controller
                name="pedagogueId"
                control={control}
                render={({
                  field: { onChange, onBlur, value, ref },
                  fieldState: { error },
                }) => (
                  <CustomSelect
                    ref={ref as any}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    label="Pedagogo(a):"
                    error={error?.message}
                    options={pedagogueOptions}
                    required
                  />
                )}
              />
            </div>

            <div className="sm:col-span-2">
              <Controller
                name="date"
                control={control}
                render={({
                  field: { onChange, onBlur, value, ref },
                  fieldState: { error },
                }) => (
                  <CustomDatePicker
                    ref={ref as any}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    label="Data:"
                    error={error?.message}
                    availableDates={validDatesForPedagogue}
                    required
                  />
                )}
              />
            </div>
          </div>

          <div className="shrink-0">
            <Field label="Motivo:" error={errors.reason?.message} required>
              <textarea
                placeholder="Descreva brevemente o motivo do atendimento (máx. 100 caracteres)"
                maxLength={300}
                rows={3}
                {...register("reason")}
                className={cn(
                  getValidationClass(!!errors.reason),
                  "resize-none",
                )}
              />
            </Field>
          </div>

          {errors.slotId && (
            <p className="shrink-0 text-center text-sm text-red-500">
              {errors.slotId.message}
            </p>
          )}

          <div
            className={cn(
              "flex flex-col flex-1 shrink-0 min-h-70 sm:min-h-0 sm:shrink rounded-2xl border bg-[#faf8f5] p-3 sm:p-4 transition-colors",
              errors.slotId ? "ring-1 ring-red-300" : "border-[#f0e9df]",
            )}
          >
            <div className="shrink-0 mb-3 sm:mb-4 flex flex-col items-center justify-center gap-3 sm:gap-6 sm:flex-row">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5a5248]">
                  <div className="h-3 w-3 rounded-full bg-[#6bc4a6]" />{" "}
                  Disponível
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5a5248]">
                  <div className="h-3 w-3 rounded-full bg-[#fcbca5]" />{" "}
                  Indisponível
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-1 pr-2 sm:pr-3 custom-scroll flex flex-col gap-2">
              {isLoadingSlots ? (
                <div className="flex items-center justify-center py-6 text-[#a0998e]">
                  <Loader2 className="animate-spin" size={24} />
                </div>
              ) : slots.length === 0 ? (
                <p className="py-4 text-center text-sm text-[#a0998e]">
                  Selecione uma data e um pedagogo para visualizar os horários.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {slots.map((slot) => (
                    <AppointmentSlot
                      key={slot.id}
                      slot={slot}
                      isSelected={selectedSlotId === slot.id}
                      onSelect={handleSelectSlot}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0 p-4 sm:px-7 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-stone-200 bg-stone-50/50">
          <CommonButton
            label="Cancelar"
            type="button"
            className="w-full sm:w-auto justify-center bg-[#f4a598] hover:bg-[#f0a195]"
          />
          <CommonButton
            label={isSubmitting ? "Enviando..." : "Confirmar Solicitação"}
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto justify-center"
          />
        </div>
      </form>
    </div>
  );
}
