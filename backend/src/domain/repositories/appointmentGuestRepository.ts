import { AppointmentGuest } from "@domain/entities/appointmentGuest";
import { AppointmentStatusVO } from "@domain/valueObjects/appointment/appointmentStatus";

import { AppointmentListParams } from "./filters/appointmentFilters";
import { PaginatedAppointmentResult, AppointmentResult } from "./results/appointmentResult";

export interface IAppointmentGuestRepository {
  findById(id: string): Promise<AppointmentResult | null>;
  findByToken(token: string): Promise<AppointmentResult | null>;
  findByPedagogueId(pedagogueId: string): Promise<AppointmentResult[]>;
  findAll(params: AppointmentListParams): Promise<PaginatedAppointmentResult>;
  save(appointmentGuest: AppointmentGuest): Promise<void>;
  update(appointmentGuest: AppointmentGuest): Promise<void>;
  updateStatus(appointmentId: string, newStatus: AppointmentStatusVO, reason?: string): Promise<void>;
}
