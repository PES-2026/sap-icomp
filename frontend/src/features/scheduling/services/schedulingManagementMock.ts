import { Course } from "@/features/courses/types/course";
import { SchedulingSlot } from "../types/scheduling";
import {
  ManagedScheduling,
  ManagedSchedulingActionResult,
  ManagedSchedulingFilters,
} from "../types/schedulingManagement";

const MOCK_DELAY_MS = 450;

const addDaysAtTime = (days: number, hours: number, minutes = 0) => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const createMockSlot = (
  slotId: string,
  pedagogueId: string,
  start: string,
  end: string,
  parentStatus: string,
): SchedulingSlot => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  return {
    id: slotId,
    pedagogueId,
    startDateTime: start,
    endDateTime: end,
    status: parentStatus === "APPROVED" ? "BOOKED" : "PENDING",
    date: startDate,
    weekday: "Monday",
    attendanceTime: (endDate.getTime() - startDate.getTime()) / 60000,
  };
};

const createMockCourse = (
  id: string,
  name: string,
  acronym: string,
): Course => ({
  id,
  name,
  acronym,
  coordinatorId: `coord-${acronym.toLowerCase()}`,
  coordinatorName: `Coordenador ${name}`,
  createdAt: "2024-01-01T08:00:00.000Z",
  updatedAt: "2025-01-01T08:00:00.000Z",
});

// --- Mock Data Builder ---

const buildMockSchedulings = (pedagogueId: string): ManagedScheduling[] => [
  {
    id: "mock-scheduling-1",
    pedagogueId,
    status: "PENDING",
    reason: "Dificuldade para organizar a rotina de estudos.",
    enrollmentId: 22450123,
    studentId: "mock-student-1",
    studentName: "Mariana Oliveira",
    email: "mariana.oliveira@icomp.ufam.edu.br",
    course: createMockCourse("mock-course-1", "Ciência da Computação", "CC"),
    slot: createMockSlot(
      "slot-1",
      pedagogueId,
      addDaysAtTime(0, 9),
      addDaysAtTime(0, 9, 50),
      "PENDING",
    ),
    createdAt: "2024-03-12T10:30:00.000Z",
    updatedAt: "2024-03-12T10:30:00.000Z",
  },
  {
    id: "mock-scheduling-2",
    pedagogueId,
    status: "APPROVED",
    reason: "Orientação sobre desempenho acadêmico no período atual.",
    enrollmentId: 22350789,
    studentId: "mock-student-2",
    studentName: "Lucas Almeida",
    email: "lucas.almeida@icomp.ufam.edu.br",
    course: createMockCourse("mock-course-2", "Engenharia de Software", "ES"),
    slot: createMockSlot(
      "slot-2",
      pedagogueId,
      addDaysAtTime(0, 14),
      addDaysAtTime(0, 14, 50),
      "APPROVED",
    ),
    createdAt: "2024-03-15T14:45:00.000Z",
    updatedAt: "2024-03-16T09:15:00.000Z",
  },
  {
    id: "mock-scheduling-3",
    pedagogueId,
    status: "APPROVED",
    reason: "Acompanhamento após dificuldades em disciplinas introdutórias.",
    enrollmentId: 22550042,
    studentId: "mock-student-3",
    studentName: "Ana Beatriz Souza",
    email: "ana.souza@icomp.ufam.edu.br",
    course: createMockCourse("mock-course-3", "Sistemas de Informação", "SI"),
    slot: createMockSlot(
      "slot-3",
      pedagogueId,
      addDaysAtTime(1, 10),
      addDaysAtTime(1, 11),
      "APPROVED",
    ),
    createdAt: "2024-03-18T08:20:00.000Z",
    updatedAt: "2024-03-18T16:00:00.000Z",
  },
  {
    id: "mock-scheduling-4",
    pedagogueId,
    status: "PENDING",
    reason: "Solicitação de apoio para planejamento acadêmico.",
    enrollmentId: 22250991,
    studentId: "mock-student-4",
    studentName: "Rafael Santos",
    email: "rafael.santos@icomp.ufam.edu.br",
    course: createMockCourse("mock-course-1", "Ciência da Computação", "CC"),
    slot: createMockSlot(
      "slot-4",
      pedagogueId,
      addDaysAtTime(3, 8),
      addDaysAtTime(3, 8, 50),
      "PENDING",
    ),
    createdAt: "2024-03-20T11:10:00.000Z",
    updatedAt: "2024-03-20T11:10:00.000Z",
  },
  {
    id: "mock-scheduling-5",
    pedagogueId,
    status: "APPROVED",
    reason: "Conversa sobre adaptação ao curso e carga de atividades.",
    enrollmentId: 22450654,
    studentId: "mock-student-5",
    studentName: "Camila Ferreira",
    email: "camila.ferreira@icomp.ufam.edu.br",
    course: createMockCourse("mock-course-2", "Engenharia de Software", "ES"),
    slot: createMockSlot(
      "slot-5",
      pedagogueId,
      addDaysAtTime(8, 15),
      addDaysAtTime(8, 15, 50),
      "APPROVED",
    ),
    createdAt: "2024-03-22T09:30:00.000Z",
    updatedAt: "2024-03-23T10:05:00.000Z",
  },
  {
    id: "mock-scheduling-6",
    pedagogueId,
    status: "CANCELED",
    reason: "Atendimento cancelado pelo estudante.",
    enrollmentId: 22150444,
    studentId: "mock-student-6",
    studentName: "Pedro Henrique Lima",
    email: "pedro.lima@icomp.ufam.edu.br",
    course: createMockCourse("mock-course-3", "Sistemas de Informação", "SI"),
    slot: createMockSlot(
      "slot-6",
      pedagogueId,
      addDaysAtTime(2, 16),
      addDaysAtTime(2, 16, 50),
      "CANCELED",
    ),
    createdAt: "2024-03-25T13:40:00.000Z",
    updatedAt: "2024-03-26T15:20:00.000Z",
  },
  {
    id: "mock-scheduling-expired",
    pedagogueId,
    status: "PENDING",
    reason: "Apoio para reorganização do plano de estudos.",
    enrollmentId: 22350117,
    studentId: "mock-student-7",
    studentName: "João Vitor Mesquita",
    email: "joao.mesquita@icomp.ufam.edu.br",
    course: createMockCourse("mock-course-1", "Ciência da Computação", "CC"),
    slot: createMockSlot(
      "slot-7",
      pedagogueId,
      addDaysAtTime(-1, 10),
      addDaysAtTime(-1, 10, 50),
      "PENDING",
    ),
    createdAt: "2024-02-15T08:00:00.000Z",
    updatedAt: "2024-02-15T08:00:00.000Z",
  },
];

// --- Mock Database & Store Logic ---

const wait = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

const schedulesStore = new Map<string, ManagedScheduling[]>();

const getSchedulingsStore = (pedagogueId = "mock-pedagogue-current") => {
  const existingSchedulings = schedulesStore.get(pedagogueId);

  if (existingSchedulings) {
    return existingSchedulings;
  }

  const schedulings = buildMockSchedulings(pedagogueId);
  schedulesStore.set(pedagogueId, schedulings);
  return schedulings;
};

const updateScheduling = (
  scheduleId: string,
  pedagogueId: string,
  update: Partial<ManagedScheduling>,
) => {
  const schedulings = getSchedulingsStore(pedagogueId);
  const scheduleIndex = schedulings.findIndex(
    (scheduling) => scheduling.id === scheduleId,
  );

  if (scheduleIndex < 0) {
    throw new Error("Solicitação de atendimento não encontrada.");
  }

  const updatedScheduling = {
    ...schedulings[scheduleIndex],
    ...update,
  };

  schedulings[scheduleIndex] = updatedScheduling;
  return updatedScheduling;
};

const getManageableScheduling = (scheduleId: string, pedagogueId: string) => {
  const scheduling = getSchedulingsStore(pedagogueId).find(
    (item) => item.id === scheduleId,
  );

  if (!scheduling) {
    throw new Error("Solicitação de atendimento não encontrada.");
  }

  if (scheduling.pedagogueId !== pedagogueId) {
    throw new Error(
      "Apenas a pedagoga responsável pode alterar esta solicitação.",
    );
  }

  if (scheduling.status !== "PENDING") {
    throw new Error("Esta solicitação não está mais pendente.");
  }

  return scheduling;
};

// --- Mock Service API ---

export const scheduleManagementMock = {
  async list(filters: ManagedSchedulingFilters): Promise<ManagedScheduling[]> {
    await wait();

    const start = new Date(`${filters.startDate}T00:00:00`);
    const end = filters.endDate
      ? new Date(`${filters.endDate}T23:59:59.999`)
      : null;

    return getSchedulingsStore(filters.pedagogueId)
      .filter((scheduling) => {
        // Agora busca as datas de dentro da propriedade "slot"
        const scheduleStart = new Date(scheduling.slot.startDateTime);
        const scheduleEnd = new Date(scheduling.slot.endDateTime);

        const matchesStatus = filters.statuses.includes(scheduling.status);
        const startsInPeriod = scheduleStart >= start;
        const endsInPeriod = !end || scheduleEnd <= end;
        const belongsToPedagogue =
          !filters.pedagogueId ||
          scheduling.pedagogueId === filters.pedagogueId;

        return (
          matchesStatus && startsInPeriod && endsInPeriod && belongsToPedagogue
        );
      })
      .sort(
        (first, second) =>
          new Date(first.slot.startDateTime).getTime() -
          new Date(second.slot.startDateTime).getTime(),
      );
  },

  async listPending(pedagogueId: string): Promise<ManagedScheduling[]> {
    await wait();

    return getSchedulingsStore(pedagogueId)
      .filter(
        (scheduling) =>
          scheduling.status === "PENDING" &&
          scheduling.pedagogueId === pedagogueId,
      )
      .sort(
        (first, second) =>
          new Date(first.slot.startDateTime).getTime() -
          new Date(second.slot.startDateTime).getTime(),
      );
  },

  async confirm(
    scheduleId: string,
    pedagogueId: string,
  ): Promise<ManagedSchedulingActionResult> {
    await wait();

    const scheduling = getManageableScheduling(scheduleId, pedagogueId);

    // Usa a data do slot para validar expiração
    if (new Date(scheduling.slot.startDateTime) <= new Date()) {
      return {
        scheduling: updateScheduling(scheduleId, pedagogueId, {
          status: "CANCELED",
          rejectionReason: "Solicitação cancelada porque o horário expirou.",
        }),
        outcome: "CANCELED",
        emailNotificationQueued: false,
        slotReleased: true,
      };
    }

    return {
      scheduling: updateScheduling(scheduleId, pedagogueId, {
        status: "APPROVED",
      }),
      outcome: "CONFIRMED",
      emailNotificationQueued: true,
      slotReleased: false,
    };
  },

  async reject(
    scheduleId: string,
    pedagogueId: string,
    justification: string,
  ): Promise<ManagedSchedulingActionResult> {
    await wait();
    getManageableScheduling(scheduleId, pedagogueId);

    if (!justification.trim()) {
      throw new Error("Informe uma justificativa para recusar a solicitação.");
    }

    return {
      // Usando 'any' temporário ou casting para aceitar "REJECTED" se o seu enum original for apenas PENDING|CONFIRMED|CANCELED
      // Assumindo que REJECTED faz parte do union type da sua interface ManagedSchedulingStatus
      scheduling: updateScheduling(scheduleId, pedagogueId, {
        status: "REJECTED" as any,
        rejectionReason: justification.trim(),
      }),
      outcome: "REJECTED",
      emailNotificationQueued: true,
      slotReleased: true,
    };
  },
};
