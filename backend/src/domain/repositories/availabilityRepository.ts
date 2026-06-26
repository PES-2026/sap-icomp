import { AppointmentType } from "@domain/enum/appointmentType";

import { Availability } from "../entities/availability";

import { AvailabilityListParams } from "./filters/availabilityFilters";
import { PaginatedAvailabilityResult, AvailabilityResult } from "./results/availabilityResult";

export interface IAvailabilityRepository {
  save(availability: Availability): Promise<void>;
  saveMany(availabilities: Availability[]): Promise<void>;
  findAllAvailabilitiesByRange(pedagogueId: string, startDate: Date, endDate: Date): Promise<AvailabilityResult[]>;
  findById(id: string): Promise<AvailabilityResult | null>;
  findAll(params: AvailabilityListParams): Promise<PaginatedAvailabilityResult>;
  remove(id: string): Promise<boolean>;
  removeMany(ids: string[]): Promise<number>;
  existsByUUID(id: string): Promise<boolean>;
  releaseAvailabilityById(availabilityId: string): Promise<void>;
  bookAvailabilityById(id: string, appointmentId: string, appointmentType: AppointmentType): Promise<void>;
}
