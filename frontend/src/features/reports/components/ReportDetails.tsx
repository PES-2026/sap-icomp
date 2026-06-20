"use client";

import CommonButton from "@/components/ui/CommonButton";
import { PATHS } from "@/constants/paths";
import { FileDown, Loader2, Pencil, Printer } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useReportById } from "../hooks/useReportById";
import { ReportErrorState } from "./ReportErrorState";

export default function ReportDetails() {
  const params = useParams();
  const router = useRouter();
  const studentId = decodeURIComponent((params.studentId as string) ?? "");
  const reportId = decodeURIComponent((params.reportId as string) ?? "");
  const { report, isLoading, error } = useReportById(reportId);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center gap-3 text-stone-500">
        <Loader2 className="animate-spin text-[#6bc4a6]" size={28} />
        Carregando relatório...
      </div>
    );
  }

  if (error || !report || report.student.id !== studentId) {
    return <ReportErrorState error={error} studentId={studentId} />;
  }

  return (
    <main className="report-view min-h-full p-4 font-sans md:p-7">
      <div className="report-screen-only mx-auto mb-4 flex w-full max-w-5xl flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">
            Visualizar Relatório
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Versão final consolidada e somente para leitura.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CommonButton
            label="Editar"
            startIcon={Pencil}
            onClick={() =>
              router.push(PATHS.edit_report(studentId, report.id))
            }
            className="bg-sky-100 text-sky-700 hover:bg-sky-200"
          />
          <CommonButton
            label="Imprimir"
            startIcon={Printer}
            onClick={() => window.print()}
            className="border border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
          />
          <CommonButton
            label="Gerar PDF"
            startIcon={FileDown}
            onClick={() => window.print()}
          />
        </div>
      </div>

      <article className="report-document mx-auto w-full max-w-5xl rounded-2xl border border-[#e8e0d5] bg-white px-6 py-7 shadow-sm md:px-10 md:py-9">
        <header className="report-document-header border-b-2 border-[#6bc4a6] pb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#319878]">
            SAP IComp · Serviço de Apoio Pedagógico
          </p>
          <h1 className="mt-2 text-2xl font-bold text-stone-900">
            Relatório de Intervenção Pedagógica
          </h1>
        </header>

        <section className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 rounded-xl bg-[#faf7f0] p-5 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Aluno
            </p>
            <p className="mt-1 text-sm font-semibold text-stone-800">
              {report.student.name}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Matrícula
            </p>
            <p className="mt-1 text-sm font-semibold text-stone-800">
              {report.student.enrollmentId}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Curso
            </p>
            <p className="mt-1 text-sm font-semibold text-stone-800">
              {report.student.course.name}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Data de criação
            </p>
            <p className="mt-1 text-sm font-semibold text-stone-800">
              {report.createdAt}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Pedagoga responsável
            </p>
            <p className="mt-1 text-sm font-semibold text-stone-800">
              {report.author.name}
            </p>
          </div>
        </section>

        <div className="mt-8 space-y-8">
          <ReportSection title="Parecer Técnico" content={report.technicalOpinion} />
          <ReportSection
            title="Intervenções Estratégicas"
            content={report.strategicInterventions}
          />
          <ReportSection
            title="Orientações aos Docentes"
            content={report.teacherGuidance}
          />
        </div>

        <footer className="mt-10 border-t border-stone-200 pt-4 text-xs text-stone-400">
          <p>
            Última atualização: {report.updatedAt} por {report.lastModifiedBy.name}
            . Versão {report.version}.
          </p>
          <p className="mt-1">
            Consolidado a partir de {report.includedAttendancesCount}{" "}
            atendimento{report.includedAttendancesCount !== 1 ? "s" : ""}
            realizado{report.includedAttendancesCount !== 1 ? "s" : ""}.
          </p>
        </footer>
      </article>

      <div className="report-screen-only mx-auto mt-4 flex w-full max-w-5xl justify-end gap-3">
        <CommonButton
          label="Voltar"
          onClick={() => router.push(PATHS.visualize_student(studentId))}
          className="bg-[#f4a598] hover:bg-[#f0a195]"
        />
        <CommonButton
          label="Voltar para Edição"
          onClick={() => router.push(PATHS.edit_report(studentId, report.id))}
        />
      </div>
    </main>
  );
}

function ReportSection({ title, content }: { title: string; content: string }) {
  return (
    <section>
      <h2 className="text-base font-bold text-stone-800">{title}</h2>
      <div className="mt-2 min-h-20 rounded-xl border border-stone-200 bg-stone-50/40 p-4">
        <p className="whitespace-pre-wrap text-sm leading-7 text-stone-700">
          {content}
        </p>
      </div>
    </section>
  );
}
