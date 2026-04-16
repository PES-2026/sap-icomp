export type PrismaStudent = {
  internalId: number;
  externalId: string;
  enrollmentId: string;
  name: string;
  email: string;
  phoneNumber: string;
  dtBirth: Date;
  diagnosis: string | null;
  potential: string | null;
  difficulties: string | null;
  courseId: string;
};
