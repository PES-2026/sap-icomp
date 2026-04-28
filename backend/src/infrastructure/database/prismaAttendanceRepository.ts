import { PrismaClient } from "../../../prisma/src/infrastructure/database/generated/client";
import { Attendance } from "../../domain/entities/attendance";
import { IAttendanceRepository } from "../../domain/repositories/attendanceRepository";

export class PrismaAttendanceRepository implements IAttendanceRepository {
  constructor(private prisma: PrismaClient) {}

  async save(attendance: Attendance): Promise<void> {
    await this.prisma.attendance.create({
      data: {
        externalId: attendance.id.value,
        studentId: attendance.studentId.value,
        date: attendance.date.value,
        type: attendance.type.value,
        demand: attendance.demand.value,
        generalObservations: attendance.generalObservations?.value ?? "",
      },
    });
  }
}
