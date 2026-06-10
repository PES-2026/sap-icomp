"use client";

import CommonButton from "@/components/ui/CommonButton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Field } from "@/components/ui/Field";
import { useSchedulePreview } from "../hooks/useSchedulePreview";
import ScheduleManualSlotForm from "./ScheduleManualSlotForm";
import SchedulePreviewList from "./SchedulePreviewList";

const baseInputClass =
  "w-full rounded-md border-[1.5px] bg-white px-4 py-3 text-center text-sm text-stone-700 outline-none transition-colors";

const getInputClass = (hasError: boolean) =>
  hasError
    ? `${baseInputClass} border-red-300 bg-red-50 focus:border-red-400`
    : `${baseInputClass} border-[#e9dfc9] hover:border-[#d6cbb5] focus:border-[#6bc4a6]`;

export default function ScheduleForm() {
  const {
    form,
    slots,
    previewPayload,
    disabledSlotIds,
    isLoading,
    isSaving,
    isConfirmOpen,
    hasGeneratedPreview,
    activeSlotsCount,
    clearPreview,
    invalidatePreview,
    toggleSlot,
    addManualSlot,
    confirmPreview,
    cancelSaveConfirmation,
    saveSchedule,
    onSubmit,
  } = useSchedulePreview();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <main className="flex min-h-[calc(100vh-100px)] w-full flex-col overflow-auto p-4 font-sans md:p-6">
      <div className="w-full">
        <form
          onSubmit={onSubmit}
          onChange={invalidatePreview}
          noValidate
          className="overflow-hidden rounded-2xl border border-[#ece7db] bg-[#faf7f0] shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        >
          <div className="px-5 pb-5 pt-6 sm:px-7 md:px-10 md:pt-8">
            <div className="mb-6">
              <h1 className="m-0 text-xl font-bold text-[#3a3530]">
                Configurar Disponibilidade
              </h1>
              <p className="mt-1 text-sm text-stone-500">
                Defina o período e revise os horários disponíveis.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 xl:grid-cols-6">
              <Field
                label="Data de início:"
                error={errors.startDate?.message}
                required
              >
                <input
                  type="date"
                  {...register("startDate")}
                  className={getInputClass(!!errors.startDate)}
                  aria-invalid={!!errors.startDate}
                />
              </Field>

              <Field
                label="Data de fim:"
                error={errors.endDate?.message}
                required
              >
                <input
                  type="date"
                  {...register("endDate")}
                  className={getInputClass(!!errors.endDate)}
                  aria-invalid={!!errors.endDate}
                />
              </Field>

              <Field
                label="Horário inicial:"
                error={errors.startTime?.message}
                required
              >
                <input
                  type="time"
                  {...register("startTime")}
                  className={getInputClass(!!errors.startTime)}
                  aria-invalid={!!errors.startTime}
                />
              </Field>

              <Field
                label="Horário final:"
                error={errors.endTime?.message}
                required
              >
                <input
                  type="time"
                  {...register("endTime")}
                  className={getInputClass(!!errors.endTime)}
                  aria-invalid={!!errors.endTime}
                />
              </Field>

              <Field
                label="Tempo de atendimento:"
                error={errors.durationMinutes?.message}
                required
              >
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="1439"
                    step="1"
                    placeholder="50"
                    {...register("durationMinutes")}
                    className={`${getInputClass(!!errors.durationMinutes)} pr-12`}
                    aria-invalid={!!errors.durationMinutes}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-stone-400">
                    min
                  </span>
                </div>
              </Field>

              <Field label="Pausa entre atendimentos:">
                <div className="relative">
                  <input
                    type="text"
                    value="0"
                    disabled
                    className={`${baseInputClass} cursor-not-allowed border-[#e9dfc9] pr-12 text-stone-400 opacity-75`}
                    aria-label="Pausa entre atendimentos indisponível"
                    title="Aguardando definição do contrato do backend"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-stone-400">
                    min
                  </span>
                </div>
              </Field>
            </div>

            <div className="mt-5 flex justify-end">
              <CommonButton
                label={isLoading ? "Gerando..." : "Gerar disponibilidade"}
                type="submit"
                disabled={isLoading}
                className="justify-center px-6 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <div className="border-t border-[#ece7db] bg-[#faf7f0] px-5 py-6 sm:px-7 md:px-10">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="m-0 text-xl font-bold text-[#3a3530]">
                  Prévia da disponibilidade
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  Clique em um horário para marcá-lo como disponível ou
                  indisponível.
                </p>
              </div>

              {hasGeneratedPreview && slots.length > 0 && (
                <div className="flex gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-[#dff3ec] px-3 py-1.5 text-[#397b65]">
                    {activeSlotsCount} ativos
                  </span>
                  <span className="rounded-full bg-[#ffe0d8] px-3 py-1.5 text-[#b95f4c]">
                    {disabledSlotIds.size} removidos
                  </span>
                </div>
              )}
            </div>

            <ScheduleManualSlotForm
              disabled={!hasGeneratedPreview || isLoading || isSaving}
              minDate={previewPayload?.startDate}
              maxDate={previewPayload?.endDate}
              minTime={previewPayload?.startTime}
              maxTime={previewPayload?.endTime}
              onAddSlot={addManualSlot}
            />

            <SchedulePreviewList
              slots={slots}
              hasGeneratedPreview={hasGeneratedPreview}
              disabledSlotIds={disabledSlotIds}
              onToggleSlot={toggleSlot}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[#ece7db] bg-[#faf7f0] px-5 py-4 sm:flex-row sm:justify-end sm:px-7 md:px-10">
            <CommonButton
              label="Cancelar"
              type="button"
              onClick={clearPreview}
              disabled={isLoading || isSaving}
              className="min-w-30 justify-center bg-[#ffae99] text-white hover:bg-[#f39a84] disabled:cursor-not-allowed disabled:opacity-60"
            />
            <CommonButton
              label={isSaving ? "Salvando..." : "Confirmar Registro"}
              type="button"
              onClick={confirmPreview}
              disabled={
                !hasGeneratedPreview || activeSlotsCount === 0 || isSaving
              }
              className="min-w-40 justify-center disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </form>

        <ConfirmModal
          open={isConfirmOpen}
          title="Salvar agenda"
          message={`Deseja salvar ${activeSlotsCount} ${
            activeSlotsCount === 1 ? "horário ativo" : "horários ativos"
          }? Os horários removidos não serão enviados.`}
          confirmLabel={isSaving ? "Salvando..." : "Salvar"}
          onConfirm={isSaving ? () => undefined : saveSchedule}
          onCancel={cancelSaveConfirmation}
        />
      </div>
    </main>
  );
}
