import api from "@/services/api";
import { AppointmentFormData } from "../schemas/appointmentSchema";
import { TimeSlot } from "../types/appointment";

export const appointmentService = {
  async getSlotsOriginal(
    date: string,
    pedagogueId: string,
  ): Promise<TimeSlot[]> {
    const response = await api.get<TimeSlot[]>("/schedules/slots", {
      params: { date, pedagogueId },
      fallbackMsg: "Não foi possível carregar os horários disponíveis.",
    });
    return response.data;
  },

  async createOriginal(data: AppointmentFormData): Promise<void> {
    await api.post("/schedules", data, {
      fallbackMsg: "Ocorreu um erro ao tentar agendar o atendimento.",
    });
  },

  async getSlots(date: string, pedagogueId: string): Promise<TimeSlot[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (pedagogueId === "ext-ped-001") {
          resolve([
            { id: "1", time: "09:00", isAvailable: true },
            { id: "2", time: "10:00", isAvailable: false },
            { id: "3", time: "11:00", isAvailable: false },
            { id: "4", time: "13:00", isAvailable: true },
            { id: "5", time: "14:00", isAvailable: true },
            { id: "6", time: "15:00", isAvailable: false },
          ]);
        } else {
          resolve([
            { id: "7", time: "08:00", isAvailable: true },
            { id: "8", time: "09:00", isAvailable: true },
            { id: "9", time: "16:00", isAvailable: false },
          ]);
        }
      }, 600);
    });
  },

  async create(data: AppointmentFormData): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Payload recebido no mock:", data);
        resolve();
      }, 1000);
    });
  },
};
