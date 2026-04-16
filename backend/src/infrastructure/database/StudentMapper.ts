import type { StudentData } from "./student-data.js";
import type { PrismaStudent } from "../../infrastructure/database/prismaTypes.js";
export class StudentMapper {
  static toDomain(prismaStudent: PrismaStudent): StudentData {
    return {
      externalId: prismaStudent.externalId,
      name: prismaStudent.name,
      enrollmentId: prismaStudent.enrollmentId,
      dtBirth: prismaStudent.dtBirth.toISOString(),
      email: prismaStudent.email,
      phoneNumber: prismaStudent.phoneNumber,
      course: prismaStudent.courseId,

      diagnosis: prismaStudent.diagnosis ?? "",
      potential: prismaStudent.potential ?? "",
      difficulties: prismaStudent.difficulties ?? "",
    };
  }

  static toPersistence(student: StudentData) {
    return {
      externalId: student.externalId,
      enrollmentId: student.enrollmentId,
      name: student.name,
      email: student.email,
      phoneNumber: student.phoneNumber,
      dtBirth: new Date(student.dtBirth),

      diagnosis: student.diagnosis || null,
      potential: student.potential || null,
      difficulties: student.difficulties || null,

      courseId: student.course,
    };
  }
}
