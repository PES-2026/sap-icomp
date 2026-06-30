export interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
  attendanceTime: number;
  status: string;
  startDateTime: string;
  endDateTime: string;
}

export interface TimeSlotResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: TimeSlot[];
}
