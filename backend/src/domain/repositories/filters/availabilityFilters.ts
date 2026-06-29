import { AvailabilityStatusEnum } from "@domain/enum/availabilityStatus";
import { PaginationParams } from "@domain/shared/pagination";

export interface AvailabilityFilters {
  status?: AvailabilityStatusEnum;
  startDate?: Date;
  endDate?: Date;
  attendanceTime?: number;
  pedagogueId?: string;
}

export type AvailabilityListParams = PaginationParams<"filters", AvailabilityFilters>;
