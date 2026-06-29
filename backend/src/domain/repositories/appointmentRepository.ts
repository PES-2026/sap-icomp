import { AppointmentStatusVO } from "@domain/valueObjects/appointment/appointmentStatus";

import { Appointment } from "../entities/appointment";

import { AppointmentListParams } from "./filters/appointmentFilters";
import { PaginatedAppointmentResult, AppointmentResult } from "./results/appointmentResult";

export interface IAppointmentRepository {
  findById(id: string): Promise<AppointmentResult | null>;
  findByToken(token: string): Promise<AppointmentResult | null>;
  findByPedagogueId(pedagogueId: string): Promise<AppointmentResult[]>;
  findAll(params: AppointmentListParams): Promise<PaginatedAppointmentResult>;
  save(appointment: Appointment): Promise<void>;
  update(appointment: Appointment): Promise<void>;
  updateStatus(appointmentId: string, newStatus: AppointmentStatusVO, reason?: string): Promise<void>;
}
