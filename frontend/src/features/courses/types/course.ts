export interface Course {
  externalId: string;
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

// Rever no futuro essas duas interfaces Create e Update
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
  data: Course[];
  page: number;
  limit: number;
  total: number;
}
