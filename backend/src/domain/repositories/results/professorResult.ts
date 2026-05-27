export interface ProfessorResult {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string | null;
  registrationNumber: string;
  userStatus: string;
  createdAt: Date;
  updatedAt: Date;
}
