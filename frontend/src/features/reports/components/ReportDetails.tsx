"use client";

import CommonButton from "@/components/ui/CommonButton";
import { PATHS } from "@/constants/paths";
import { useStudentById } from "@/features/students/hooks/useStudentById";
import { useAuthStore } from "@/store/authStore";
import { FileDown, Loader2, Pencil, Printer } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { REPORT_TEMPLATE } from "../constants/reportTemplate";
import { useReportById } from "../hooks/useReportById";
import { formatReportLongDate } from "../utils/reportDates";
import { LexicalReportEditor } from "./LexicalReportEditor";
import { ReportErrorState } from "./ReportErrorState";

export default function ReportDetails() {
  const params = useParams();
  const router = useRouter();
  const authenticatedUser = useAuthStore((state) => state.user);
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

  const pedagogueRegistrationNumber =
    report.pedagogueRegistrationNumber ??
    (authenticatedUser?.name === report.pedagogueName
      ? authenticatedUser.registrationNumber
      : undefined);

  return (
    <main className="report-view min-h-full p-4 font-sans md:p-7">
      <div className="report-screen-only mx-auto mb-4 flex w-full max-w-[210mm] flex-wrap items-center justify-between gap-3">
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
            disabled
            title="Funcionalidade pendente"
            className="border border-stone-200 bg-white text-stone-400 hover:scale-100 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          />
          <CommonButton
            label="Gerar PDF"
            startIcon={FileDown}
            disabled
            title="Funcionalidade pendente"
            className="hover:scale-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <article className="report-document mx-auto min-h-[297mm] w-full max-w-[210mm] border border-stone-200 bg-white px-6 py-10 font-['Arial',sans-serif] text-black shadow-sm sm:px-[20mm] sm:py-[16mm]">
        <header className="report-document-header text-center">
          <div className="text-[9.5pt] font-normal uppercase leading-[1.25]">
            {REPORT_TEMPLATE.institution.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <h1 className="mt-9 text-[13pt] font-bold">
            {REPORT_TEMPLATE.title}
          </h1>
        </header>

        <section className="mt-7 text-[10.5pt] leading-[1.4]">
          <p>
            <span className="font-medium">Aluno:</span> {student.name}
          </p>
          <p>
            <span className="font-medium">Matrícula:</span>{" "}
            {student.enrollmentId}
          </p>
          <p>
            <span className="font-medium">Curso:</span>{" "}
            {student.course?.name ?? "Curso não informado"}
          </p>
        </section>

        <div className="mt-5 space-y-4">
          <ReportSection
            title="Deficiência/Condição:"
            content={report.condition}
          />
          <ReportSection title="Potencialidades:" content={report.potential} />
          <ReportSection title="Dificuldades:" content={report.difficulties} />
          <ReportSection
            title="Recomendações metodológicas:"
            content={report.recommendation}
          />
          <ReportSection
            title="Considerações finais:"
            content={report.conclusion}
          />
        </div>

        <section className="mt-5 text-justify text-[10.5pt] leading-[1.45]">
          <p>
            {REPORT_TEMPLATE.contactIntroduction}{" "}
            <a
              href={`mailto:${REPORT_TEMPLATE.supportEmail}`}
              className="text-sky-700 underline"
            >
              {REPORT_TEMPLATE.supportEmail}
            </a>
          </p>
        </section>

        <p className="mt-9 text-center text-[10.5pt]">
          {formatReportLongDate(
            report.createdAt,
            REPORT_TEMPLATE.location,
          )}
        </p>

        <footer className="report-signature mt-14 text-center text-[10.5pt] leading-[1.45]">
          <p>{report.pedagogueName}</p>
          <p>
            {REPORT_TEMPLATE.signatureRole}
            {pedagogueRegistrationNumber
              ? ` – SIAPE ${pedagogueRegistrationNumber}`
              : ""}
          </p>
          <p>{REPORT_TEMPLATE.signatureUnit}</p>
        </footer>
      </article>
    </main>
  );
}

function ReportSection({ title, content }: { title: string; content: string }) {
  return (
    <section className="text-[10.5pt] leading-[1.45]">
      <h2 className="mb-1 font-bold">{title}</h2>
      <LexicalReportEditor value={content} readOnly appearance="document" />
    </section>
  );
}
