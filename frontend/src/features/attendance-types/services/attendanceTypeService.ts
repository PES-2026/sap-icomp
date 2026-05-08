import {
  AttendanceType,
  AttendanceTypeResponse,
} from "../types/attendanceType";

let mockDatabase: AttendanceType[] = [
  {
    externalId: "1",
    name: "Aprendizagem",
    createdAt: "05/05/2026",
    updatedAt: "05/05/2026",
  },
  {
    externalId: "2",
    name: "Vulnerabilidade Socioeconômica",
    createdAt: "06/05/2026",
    updatedAt: "06/05/2026",
  },
  {
    externalId: "3",
    name: "Emocional",
    createdAt: "06/05/2026",
    updatedAt: "06/05/2026",
  },
  {
    externalId: "4",
    name: "Deficiência",
    createdAt: "07/05/2026",
    updatedAt: "07/05/2026",
  },
];

const delay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const attendanceTypeService = {
  async getAll(
    page: number = 1,
    limit: number = 100,
  ): Promise<AttendanceTypeResponse> {
    await delay();

    return {
      totalItems: mockDatabase.length,
      totalPages: Math.ceil(mockDatabase.length / limit),
      currentPage: page,
      items: [...mockDatabase],
    };
  },

  async getById(id: string): Promise<AttendanceType> {
    await delay(500);
    const item = mockDatabase.find((i) => i.externalId === id);

    if (!item) {
      throw new Error("Tipo de atendimento não encontrado.");
    }
    return item;
  },

  async create(data: { name: string }): Promise<AttendanceType> {
    await delay();

    if (
      mockDatabase.some((i) => i.name.toLowerCase() === data.name.toLowerCase())
    ) {
      throw new Error("Já existe um tipo de atendimento com este nome.");
    }

    const newItem: AttendanceType = {
      externalId: Math.random().toString(36).substring(7),
      name: data.name,
      createdAt: new Date().toLocaleDateString("pt-BR"),
      updatedAt: new Date().toLocaleDateString("pt-BR"),
    };

    mockDatabase.push(newItem);
    return newItem;
  },

  async update(id: string, data: { name: string }): Promise<AttendanceType> {
    await delay();

    const index = mockDatabase.findIndex((i) => i.externalId === id);
    if (index === -1) {
      throw new Error("Tipo de atendimento não encontrado para edição.");
    }

    mockDatabase[index] = {
      ...mockDatabase[index],
      name: data.name,
      updatedAt: new Date().toLocaleDateString("pt-BR"),
    };

    return mockDatabase[index];
  },

  async remove(id: string): Promise<void> {
    await delay();

    const initialLength = mockDatabase.length;
    mockDatabase = mockDatabase.filter((i) => i.externalId !== id);

    if (mockDatabase.length === initialLength) {
      throw new Error("Não foi possível remover: item não encontrado.");
    }
  },
};
