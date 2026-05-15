export interface Course {
  id: string;
  name: string;
  acronym: string;
  coordinatorId?: string;
  coordinatorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoursePayload {
  name: string;
  acronym: string;
  coordinatorId?: string;
}

export interface CreateCourseResponse {
  externalId: string;
  name: string;
  acronym: string;
  coordinatorId?: string;
}

export interface UpdateCourseResponse {
  externalId: string;
  name: string;
  acronym: string;
  coordinatorId?: string;
}

export interface CoursesResponse {
  totalPages: number;
  currentPage: number;
  totalItems: number;
  items: Course[];
}
