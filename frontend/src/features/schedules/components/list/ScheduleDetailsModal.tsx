"use client";

import CommonButton from "@/components/ui/CommonButton";
import { X } from "lucide-react";
import { ManagedSchedule } from "../../types/scheduleManagement";
import {
  formatScheduleDate,
  formatScheduleDateTime,
  formatScheduleTime,
} from "../../utils/scheduleDates";
import ScheduleStatusBadge from "./ScheduleStatusBadge";

interface ScheduleDetailsModalProps {
  schedule: ManagedSchedule | null;
  onClose: () => void;
}

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-xs font-semibold uppercase tracking-wide text-stone-400">
      {label}
    </dt>
    <dd className="mt-1 text-sm font-medium text-[#4a4540]">{value}</dd>
  </div>
);

export default function ScheduleDetailsModal({
  schedule,
  onClose,
}: ScheduleDetailsModalProps) {
  if (!schedule) return null;

  return (
    <div
      className="fixed inset-0 z-1000 flex items-center justify-center bg-black/35 p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-details-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="schedule-details-title"
              className="text-xl font-bold text-[#3a3530]"
            >
              Detalhes do agendamento
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Informações enviadas pelo estudante.
            </p>
          </div>
          <button
            type="button"
            aria-label="Fechar modal"
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
          >
            <X size={20} />
          </button>
        </header>

        <div className="mb-6 flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-4">
          <div>
            <p className="font-semibold text-[#3a3530]">
              {formatScheduleDate(schedule.startDateTime)}
            </p>
            <p className="mt-1 text-sm text-stone-500">
              {formatScheduleTime(schedule.startDateTime)} às{" "}
              {formatScheduleTime(schedule.endDateTime)}
            </p>
          </div>
          <ScheduleStatusBadge status={schedule.status} />
        </div>

        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Detail label="Aluno" value={schedule.student.name} />
          <Detail
            label="Matrícula"
            value={schedule.student.enrollmentId}
          />
          <Detail label="E-mail" value={schedule.student.email} />
          <Detail
            label="Telefone"
            value={schedule.student.phoneNumber ?? "Não informado"}
          />
          <Detail
            label="Curso"
            value={`${schedule.course.name} (${schedule.course.acronym})`}
          />
          <Detail
            label="Solicitado em"
            value={formatScheduleDateTime(schedule.requestedAt)}
          />
          <div className="sm:col-span-2">
            <Detail label="Motivo do atendimento" value={schedule.reason} />
          </div>
          {schedule.rejectionReason && (
            <div className="sm:col-span-2">
              <Detail
                label="Justificativa da recusa"
                value={schedule.rejectionReason}
              />
            </div>
          )}
        </dl>

        <footer className="mt-8 flex justify-end">
          <CommonButton
            label="Fechar"
            type="button"
            onClick={onClose}
            className="min-w-24 justify-center"
          />
        </footer>
      </section>
    </div>
  );
}
