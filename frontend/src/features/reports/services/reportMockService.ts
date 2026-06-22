import { attendanceService } from "@/features/attendances/services/attendanceService";
import { studentService } from "@/features/students/services/studentService";
import { ApiError } from "@/services/apiError";
import { useAuthStore } from "@/store/authStore";
import {
  CreateReportData,
  ReportDetailsResponse,
  ReportInitialData,
  ReportMutationResponse,
  ReportSummary,
  UpdateReportData,
} from "../types/report";
import { plainTextToLexical } from "../utils/lexicalState";

interface StoredMockReport extends ReportDetailsResponse {
  id: string;
  studentId: string;
  pedagogueId: string;
  deletedAt?: string;
}

const STORAGE_KEY = "@App:intervention-reports:v2";
const MOCK_DELAY_MS = 250;

export const MOCK_REPORT_DELETE_PASSWORD = "senha123";

let memoryReports: StoredMockReport[] = [];

const wait = () =>
  new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

const readReports = (): StoredMockReport[] => {
  if (typeof window === "undefined") return memoryReports;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as StoredMockReport[]) : [];
  } catch {
    return [];
  }
};

const writeReports = (reports: StoredMockReport[]) => {
  memoryReports = reports;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }
};

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `mock-report-${Date.now()}`;

const findActiveReport = (studentId: string, reportId: string) => {
  const report = readReports().find(
    (item) =>
      item.id === reportId &&
      item.studentId === studentId &&
      item.deletedAt == null,
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

const getCompletedAttendancesCount = async (studentId: string) => {
  const response = await attendanceService.getAttendancesByStudent(
    studentId,
    1,
    1000,
  );

  // The current attendance API does not always expose a status. During the
  // report mock, legacy attendance records are treated as completed.
  return response.items.filter(
    (attendance) =>
      attendance.status === "COMPLETED" || attendance.status == null,
  ).length;
};

export const reportMockService = {
  async listByStudent(studentId: string): Promise<ReportSummary[]> {
    await wait();
    return readReports()
      .filter(
        (report) => report.studentId === studentId && report.deletedAt == null,
      )
      .sort((first, second) =>
        second.createdAt.localeCompare(first.createdAt),
      )
      .map((report) => ({
        id: report.id,
        pedagogueName: report.pedagogueName,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        shared: report.shared,
        includedAttendancesCount: report.includedAttendancesCount,
      }));
  },

  async getById(
    studentId: string,
    reportId: string,
  ): Promise<ReportDetailsResponse> {
    await wait();
    return findActiveReport(studentId, reportId);
  },

  async getInitialData(studentId: string): Promise<ReportInitialData> {
    const [student, completedAttendancesCount] = await Promise.all([
      studentService.getStudentById(studentId),
      getCompletedAttendancesCount(studentId),
    ]);

    if (completedAttendancesCount === 0) {
      throw new ApiError(
        "Não é possível gerar um relatório consolidado para alunos sem histórico de atendimentos realizados.",
        422,
        "NO_COMPLETED_ATTENDANCES",
      );
    }

    await wait();
    return {
      potential: student.potential ?? "",
      difficulties: student.difficulties ?? "",
    };
  },

  async create(
    studentId: string,
    data: CreateReportData,
  ): Promise<ReportMutationResponse> {
    const [student, completedAttendancesCount] = await Promise.all([
      studentService.getStudentById(studentId),
      getCompletedAttendancesCount(studentId),
    ]);

    if (completedAttendancesCount === 0) {
      throw new ApiError(
        "Não é possível gerar um relatório consolidado para alunos sem histórico de atendimentos realizados.",
        422,
        "NO_COMPLETED_ATTENDANCES",
      );
    }

    await wait();
    const now = new Date().toISOString();
    const authenticatedUser = useAuthStore.getState().user;
    const report: StoredMockReport = {
      id: createId(),
      studentId,
      pedagogueId: data.pedagogueId,
      studentInformation: plainTextToLexical(
        `${student.name} · ${student.enrollmentId} · ${student.course?.name ?? "Curso não informado"}`,
      ),
      pedagogueName: authenticatedUser?.name ?? "Pedagoga responsável",
      pedagogueRegistrationNumber: authenticatedUser?.registrationNumber,
      condition: data.condition,
      potential: data.potential,
      difficulties: data.difficulties,
      recommendation: data.recommendation,
      conclusion: data.conclusion,
      createdAt: now,
      updatedAt: now,
      version: 1,
      shared: false,
      includedAttendancesCount: completedAttendancesCount,
    };

    writeReports([...readReports(), report]);
    return report;
  },

  async update(
    studentId: string,
    reportId: string,
    data: UpdateReportData,
  ): Promise<ReportMutationResponse> {
    await wait();
    const current = findActiveReport(studentId, reportId);
    const updated: StoredMockReport = {
      ...current,
      pedagogueId: data.pedagogueId,
      condition: data.condition,
      potential: data.potential,
      difficulties: data.difficulties,
      recommendation: data.recommendation,
      conclusion: data.conclusion,
      updatedAt: new Date().toISOString(),
      version: (current.version ?? 1) + 1,
    };

    writeReports(
      readReports().map((report) =>
        report.id === reportId ? updated : report,
      ),
    );
    return updated;
  },

  async remove(
    studentId: string,
    reportId: string,
    password: string,
  ): Promise<void> {
    await wait();
    const current = findActiveReport(studentId, reportId);

    if (current.shared) {
      throw new ApiError(
        "Relatórios compartilhados com docentes não podem ser excluídos.",
        409,
        "REPORT_ALREADY_SHARED",
      );
    }

    if (password !== MOCK_REPORT_DELETE_PASSWORD) {
      throw new ApiError("Senha incorreta.", 401, "INVALID_PASSWORD");
    }

    writeReports(
      readReports().map((report) =>
        report.id === reportId
          ? { ...report, deletedAt: new Date().toISOString() }
          : report,
      ),
    );
  },
};
