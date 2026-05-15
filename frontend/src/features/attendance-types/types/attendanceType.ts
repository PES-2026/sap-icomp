export interface AttendanceType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceTypeResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: AttendanceType[];
}
