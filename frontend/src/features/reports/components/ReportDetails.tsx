"use client";

import CommonButton from "@/components/ui/CommonButton";
import { PATHS } from "@/constants/paths";
import { useStudentById } from "@/features/students/hooks/useStudentById";
import { FileDown, Loader2, Pencil, Printer } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useReportById } from "../hooks/useReportById";
import { isLexicalEmpty } from "../utils/lexicalState";
import { formatReportDate } from "../utils/reportDates";
import { LexicalReportEditor } from "./LexicalReportEditor";
import { ReportErrorState } from "./ReportErrorState";

export default function ReportDetails() {
  const params = useParams();
  const router = useRouter();
  const studentId = decodeURIComponent((params.studentId as string) ?? "");
  const reportId = decodeURIComponent((params.reportId as string) ?? "");
  const { report, isLoading, error } = useReportById(studentId, reportId);
  const { student, isLoadingStudent } = useStudentById(studentId);

  if (isLoading || isLoadingStudent) {
    return (
      <div className="flex h-full items-center justify-center gap-3 text-stone-500">
        <Loader2 className="animate-spin text-[#6bc4a6]" size={28} />
        Carregando relatório...
      </div>
    );
  }

  if (error || !report || !student) {
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
            label="Voltar para Edição"
            startIcon={Pencil}
            onClick={() => router.push(PATHS.edit_report(studentId, reportId))}
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
          <DocumentInformation label="Aluno" value={student.name} />
          <DocumentInformation
            label="Matrícula"
            value={student.enrollmentId}
          />
          <DocumentInformation
            label="Curso"
            value={student.course?.name ?? "Curso não informado"}
          />
          <DocumentInformation
            label="Data de criação"
            value={formatReportDate(report.createdAt)}
          />
          <DocumentInformation
            label="Pedagoga responsável"
            value={report.pedagogueName}
            className="sm:col-span-2"
          />
        </section>

        <div className="mt-8 space-y-8">
          {!isLexicalEmpty(report.studentInformation) && (
            <ReportSection
              title="Informações do Estudante"
              content={report.studentInformation}
            />
          )}
          <section>
            <h2 className="text-base font-bold text-stone-800">
              Parecer Técnico
            </h2>
            <div className="mt-3 space-y-4">
              <ReportSection
                title="Condição do estudante"
                content={report.condition}
              />
              <ReportSection
                title="Potencialidades"
                content={report.potential}
              />
              <ReportSection
                title="Dificuldades"
                content={report.difficulties}
              />
            </div>
          </section>
          <ReportSection
            title="Intervenções Estratégicas"
            content={report.recommendation}
          />
          <ReportSection
            title="Orientações aos Docentes"
            content={report.conclusion}
          />
        </div>

        <footer className="mt-10 border-t border-stone-200 pt-4 text-xs text-stone-400">
          <p>Última atualização: {formatReportDate(report.updatedAt)}.</p>
          {report.version != null && (
            <p className="mt-1">Versão {report.version}.</p>
          )}
          {report.includedAttendancesCount != null && (
            <p className="mt-1">
              Consolidado a partir de {report.includedAttendancesCount}{" "}
              atendimento
              {report.includedAttendancesCount !== 1 ? "s" : ""} realizado
              {report.includedAttendancesCount !== 1 ? "s" : ""}.
            </p>
          )}
        </footer>
      </article>
    </main>
  );
}

function DocumentInformation({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-stone-800">{value}</p>
    </div>
  );
}

function ReportSection({ title, content }: { title: string; content: string }) {
  return (
    <section>
      <h3 className="text-sm font-bold text-stone-700">{title}</h3>
      <div className="mt-2">
        <LexicalReportEditor value={content} readOnly />
      </div>
    </section>
  );
}
