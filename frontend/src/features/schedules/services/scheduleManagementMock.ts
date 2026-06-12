import {
  ManagedSchedule,
  ManagedScheduleActionResult,
  ManagedScheduleFilters,
} from "../types/scheduleManagement";

const MOCK_DELAY_MS = 450;

const addDaysAtTime = (days: number, hours: number, minutes = 0) => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const buildMockSchedules = (
  responsiblePedagogueId: string,
): ManagedSchedule[] => [
  {
    id: "mock-schedule-1",
    responsiblePedagogueId,
    status: "PENDING",
    startDateTime: addDaysAtTime(0, 9),
    endDateTime: addDaysAtTime(0, 9, 50),
    reason: "Dificuldade para organizar a rotina de estudos.",
    requestedAt: addDaysAtTime(-2, 14, 20),
    student: {
      id: "mock-student-1",
      name: "Mariana Oliveira",
      enrollmentId: "22450123",
      email: "mariana.oliveira@icomp.ufam.edu.br",
      phoneNumber: "(92) 99123-4567",
    },
    course: {
      id: "mock-course-1",
      name: "Ciência da Computação",
      acronym: "CC",
    },
  },
  {
    id: "mock-schedule-2",
    responsiblePedagogueId,
    status: "CONFIRMED",
    startDateTime: addDaysAtTime(0, 14),
    endDateTime: addDaysAtTime(0, 14, 50),
    reason: "Orientação sobre desempenho acadêmico no período atual.",
    requestedAt: addDaysAtTime(-4, 10, 15),
    student: {
      id: "mock-student-2",
      name: "Lucas Almeida",
      enrollmentId: "22350789",
      email: "lucas.almeida@icomp.ufam.edu.br",
      phoneNumber: "(92) 99234-5678",
    },
    course: {
      id: "mock-course-2",
      name: "Engenharia de Software",
      acronym: "ES",
    },
  },
  {
    id: "mock-schedule-3",
    responsiblePedagogueId,
    status: "CONFIRMED",
    startDateTime: addDaysAtTime(1, 10),
    endDateTime: addDaysAtTime(1, 11),
    reason: "Acompanhamento após dificuldades em disciplinas introdutórias.",
    requestedAt: addDaysAtTime(-1, 16, 40),
    student: {
      id: "mock-student-3",
      name: "Ana Beatriz Souza",
      enrollmentId: "22550042",
      email: "ana.souza@icomp.ufam.edu.br",
      phoneNumber: "(92) 99345-6789",
    },
    course: {
      id: "mock-course-3",
      name: "Sistemas de Informação",
      acronym: "SI",
    },
  },
  {
    id: "mock-schedule-4",
    responsiblePedagogueId,
    status: "PENDING",
    startDateTime: addDaysAtTime(3, 8),
    endDateTime: addDaysAtTime(3, 8, 50),
    reason: "Solicitação de apoio para planejamento acadêmico.",
    requestedAt: addDaysAtTime(0, 8, 10),
    student: {
      id: "mock-student-4",
      name: "Rafael Santos",
      enrollmentId: "22250991",
      email: "rafael.santos@icomp.ufam.edu.br",
      phoneNumber: "(92) 99456-7890",
    },
    course: {
      id: "mock-course-1",
      name: "Ciência da Computação",
      acronym: "CC",
    },
  },
  {
    id: "mock-schedule-5",
    responsiblePedagogueId,
    status: "CONFIRMED",
    startDateTime: addDaysAtTime(8, 15),
    endDateTime: addDaysAtTime(8, 15, 50),
    reason: "Conversa sobre adaptação ao curso e carga de atividades.",
    requestedAt: addDaysAtTime(-1, 9, 30),
    student: {
      id: "mock-student-5",
      name: "Camila Ferreira",
      enrollmentId: "22450654",
      email: "camila.ferreira@icomp.ufam.edu.br",
      phoneNumber: "(92) 99567-8901",
    },
    course: {
      id: "mock-course-2",
      name: "Engenharia de Software",
      acronym: "ES",
    },
  },
  {
    id: "mock-schedule-6",
    responsiblePedagogueId,
    status: "CANCELLED",
    startDateTime: addDaysAtTime(2, 16),
    endDateTime: addDaysAtTime(2, 16, 50),
    reason: "Atendimento cancelado pelo estudante.",
    requestedAt: addDaysAtTime(-3, 11),
    student: {
      id: "mock-student-6",
      name: "Pedro Henrique Lima",
      enrollmentId: "22150444",
      email: "pedro.lima@icomp.ufam.edu.br",
    },
    course: {
      id: "mock-course-3",
      name: "Sistemas de Informação",
      acronym: "SI",
    },
  },
  {
    id: "mock-schedule-expired",
    responsiblePedagogueId,
    status: "PENDING",
    startDateTime: addDaysAtTime(-1, 10),
    endDateTime: addDaysAtTime(-1, 10, 50),
    reason: "Apoio para reorganização do plano de estudos.",
    requestedAt: addDaysAtTime(-5, 13, 45),
    student: {
      id: "mock-student-7",
      name: "João Vitor Mesquita",
      enrollmentId: "22350117",
      email: "joao.mesquita@icomp.ufam.edu.br",
      phoneNumber: "(92) 99678-9012",
    },
    course: {
      id: "mock-course-1",
      name: "Ciência da Computação",
      acronym: "CC",
    },
  },
];

const wait = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

const schedulesStore = new Map<string, ManagedSchedule[]>();

const getSchedulesStore = (pedagogueId = "mock-pedagogue-current") => {
  const existingSchedules = schedulesStore.get(pedagogueId);

  if (existingSchedules) {
    return existingSchedules;
  }

  const schedules = buildMockSchedules(pedagogueId);
  schedulesStore.set(pedagogueId, schedules);
  return schedules;
};

const updateSchedule = (
  scheduleId: string,
  pedagogueId: string,
  update: Partial<ManagedSchedule>,
) => {
  const schedules = getSchedulesStore(pedagogueId);
  const scheduleIndex = schedules.findIndex(
    (schedule) => schedule.id === scheduleId,
  );

  if (scheduleIndex < 0) {
    throw new Error("Solicitação de atendimento não encontrada.");
  }

  const updatedSchedule = {
    ...schedules[scheduleIndex],
    ...update,
  };

  schedules[scheduleIndex] = updatedSchedule;
  return updatedSchedule;
};

const getManageableSchedule = (
  scheduleId: string,
  pedagogueId: string,
) => {
  const schedule = getSchedulesStore(pedagogueId).find(
    (item) => item.id === scheduleId,
  );

  if (!schedule) {
    throw new Error("Solicitação de atendimento não encontrada.");
  }

  if (schedule.responsiblePedagogueId !== pedagogueId) {
    throw new Error(
      "Apenas a pedagoga responsável pode alterar esta solicitação.",
    );
  }

  if (schedule.status !== "PENDING") {
    throw new Error("Esta solicitação não está mais pendente.");
  }

  return schedule;
};

export const scheduleManagementMock = {
  async list(
    filters: ManagedScheduleFilters,
  ): Promise<ManagedSchedule[]> {
    await wait();

    const start = new Date(`${filters.startDate}T00:00:00`);
    const end = filters.endDate
      ? new Date(`${filters.endDate}T23:59:59.999`)
      : null;

    return getSchedulesStore(filters.pedagogueId)
      .filter((schedule) => {
        const scheduleStart = new Date(schedule.startDateTime);
        const scheduleEnd = new Date(schedule.endDateTime);
        const matchesStatus = filters.statuses.includes(schedule.status);
        const startsInPeriod = scheduleStart >= start;
        const endsInPeriod = !end || scheduleEnd <= end;
        const belongsToPedagogue =
          !filters.pedagogueId ||
          schedule.responsiblePedagogueId === filters.pedagogueId;

        return (
          matchesStatus &&
          startsInPeriod &&
          endsInPeriod &&
          belongsToPedagogue
        );
      })
      .sort(
        (first, second) =>
          new Date(first.startDateTime).getTime() -
          new Date(second.startDateTime).getTime(),
      );
  },

  async listPending(pedagogueId: string): Promise<ManagedSchedule[]> {
    await wait();

    return getSchedulesStore(pedagogueId)
      .filter(
        (schedule) =>
          schedule.status === "PENDING" &&
          schedule.responsiblePedagogueId === pedagogueId,
      )
      .sort(
        (first, second) =>
          new Date(first.startDateTime).getTime() -
          new Date(second.startDateTime).getTime(),
      );
  },

  async confirm(
    scheduleId: string,
    pedagogueId: string,
  ): Promise<ManagedScheduleActionResult> {
    await wait();

    const schedule = getManageableSchedule(scheduleId, pedagogueId);

    if (new Date(schedule.startDateTime) <= new Date()) {
      return {
        schedule: updateSchedule(scheduleId, pedagogueId, {
          status: "CANCELLED",
          rejectionReason: "Solicitação cancelada porque o horário expirou.",
        }),
        outcome: "CANCELLED",
        emailNotificationQueued: false,
        slotReleased: true,
      };
    }

    return {
      schedule: updateSchedule(scheduleId, pedagogueId, {
        status: "CONFIRMED",
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
  ): Promise<ManagedScheduleActionResult> {
    await wait();
    getManageableSchedule(scheduleId, pedagogueId);

    if (!justification.trim()) {
      throw new Error("Informe uma justificativa para recusar a solicitação.");
    }

    return {
      schedule: updateSchedule(scheduleId, pedagogueId, {
        status: "REJECTED",
        rejectionReason: justification.trim(),
      }),
      outcome: "REJECTED",
      emailNotificationQueued: true,
      slotReleased: true,
    };
  },
};
