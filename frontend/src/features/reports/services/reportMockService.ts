import { Attendance } from "@/features/attendances/types/attendance";
import { ApiError } from "@/services/apiError";
import {
  CreateReportData,
  InterventionReport,
  ReportEligibility,
  UpdateReportData,
} from "../types/report";

const STORAGE_KEY = "@App:intervention-reports";
export const REPORTS_CHANGED_EVENT = "intervention-reports-changed";
export const MOCK_DELETE_PASSWORD = "senha123";
const MOCK_DELAY_MS = 250;

let memoryReports: InterventionReport[] = [];

const wait = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

const readReports = (): InterventionReport[] => {
  if (typeof window === "undefined") return memoryReports;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as InterventionReport[]) : [];
  } catch {
    return [];
  }
};

const writeReports = (reports: InterventionReport[]) => {
  memoryReports = reports;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    window.dispatchEvent(new Event(REPORTS_CHANGED_EVENT));
  }
};

const formatManausDateTime = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Manaus",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("day")}/${get("month")}/${get("year")} ${get("hour")}:${get("minute")}`;
};

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `mock-report-${Date.now()}`;

const findActiveReport = (reportId: string) => {
  const report = readReports().find(
    (item) => item.id === reportId && !item.deletedAt,
  );

  if (!report) {
    throw new ApiError(
      "Relatório não localizado no sistema.",
      404,
      "REPORT_NOT_FOUND",
    );
  }

  return report;
};

export const reportMockService = {
  async listByStudent(studentId: string): Promise<InterventionReport[]> {
    await wait();
    return readReports()
      .filter((report) => report.student.id === studentId && !report.deletedAt)
      .reverse();
  },

  async getById(reportId: string): Promise<InterventionReport> {
    await wait();
    return findActiveReport(reportId);
  },

  async getEligibility(attendances: Attendance[]): Promise<ReportEligibility> {
    await wait();

    // Registros legados ainda não expõem status. Durante o mock eles são
    // considerados realizados; quando o backend enviar status, só COMPLETED vale.
    const completedAttendancesCount = attendances.filter(
      (attendance) =>
        attendance.status === "COMPLETED" || attendance.status == null,
    ).length;

    return {
      canCreate: completedAttendancesCount > 0,
      completedAttendancesCount,
      reason:
        completedAttendancesCount === 0
          ? "NO_COMPLETED_ATTENDANCES"
          : undefined,
    };
  },

  async create(data: CreateReportData): Promise<InterventionReport> {
    await wait();
    const now = formatManausDateTime();
    const report: InterventionReport = {
      id: createId(),
      student: data.student,
      author: data.author,
      lastModifiedBy: data.author,
      technicalOpinion: data.technicalOpinion.trim(),
      strategicInterventions: data.strategicInterventions.trim(),
      teacherGuidance: data.teacherGuidance.trim(),
      createdAt: now,
      updatedAt: now,
      version: 1,
      shared: false,
      includedAttendancesCount: data.includedAttendancesCount,
    };

    writeReports([...readReports(), report]);
    return report;
  },

  async update(
    reportId: string,
    data: UpdateReportData,
  ): Promise<InterventionReport> {
    await wait();
    const current = findActiveReport(reportId);

    if (current.version !== data.version) {
      throw new ApiError(
        "Este relatório foi modificado por outra profissional.",
        409,
        "REPORT_VERSION_CONFLICT",
        { currentVersion: current.version },
      );
    }

    const updated: InterventionReport = {
      ...current,
      technicalOpinion: data.technicalOpinion.trim(),
      strategicInterventions: data.strategicInterventions.trim(),
      teacherGuidance: data.teacherGuidance.trim(),
      lastModifiedBy: data.lastModifiedBy,
      updatedAt: formatManausDateTime(),
      version: current.version + 1,
    };

    writeReports(
      readReports().map((report) =>
        report.id === reportId ? updated : report,
      ),
    );
    return updated;
  },

  async remove(reportId: string, password: string): Promise<void> {
    await wait();
    const current = findActiveReport(reportId);

    if (current.shared) {
      throw new ApiError(
        "Relatórios compartilhados com docentes não podem ser excluídos.",
        409,
        "REPORT_ALREADY_SHARED",
      );
    }

    if (password !== MOCK_DELETE_PASSWORD) {
      throw new ApiError("Senha incorreta.", 401, "INVALID_PASSWORD");
    }

    writeReports(
      readReports().map((report) =>
        report.id === reportId
          ? { ...report, deletedAt: formatManausDateTime() }
          : report,
      ),
    );
  },
};
