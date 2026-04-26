import { PrismaClient } from "../../../prisma/src/infrastructure/database/generated/client";
import { Attendance } from "../../domain/entities/attendance";
import { IAttendanceRepository } from "../../domain/repositories/attendanceRepository";

export class PrismaAttendanceRepository implements IAttendanceRepository {
  constructor(private prisma: PrismaClient) {}

  async save(attendance: Attendance): Promise<void> {
    await this.prisma.attendance.create({
      data: {
        id: attendance.id,
        studentId: attendance.studentId,
        date: attendance.date,
        type: attendance.type,
        demand: attendance.demand,
        generalObservations: attendance.generalObservations,
      },
    });
  }
}
