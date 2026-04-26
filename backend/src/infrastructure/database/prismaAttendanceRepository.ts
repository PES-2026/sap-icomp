import {
  PrismaClient,
  Prisma,
} from "../../../prisma/src/infrastructure/database/generated/client";
import {
  AttendanceItemResponse,
  ListAttendanceRequest,
  ListAttendanceResponse,
} from "../../application/dtos/attendance/listAttendance.dto";
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

  async findAll(
    params: ListAttendanceRequest,
  ): Promise<ListAttendanceResponse> {
    const { page, limit, filters } = params;
    const offset = (page - 1) * limit;

    const where: Prisma.AttendanceWhereInput = {
      ...(filters.studentName && {
        student: {
          name: { contains: filters.studentName, mode: "insensitive" },
        },
      }),
      ...(filters.studentCourse && {
        student: {
          name: { contains: filters.studentCourse, mode: "insensitive" },
        },
      }),
      ...(filters.studentEnrollment && {
        student: {
          enrollmentId: filters.studentEnrollment,
        },
      }),
      ...(filters.attendanceType && { type: filters.attendanceType }),
      ...(filters.startDate &&
        filters.endDate && {
          date: {
            ...(filters.startDate && { gte: filters.startDate }),
            ...(filters.endDate && { lte: filters.endDate }),
          },
        }),
    };

    const [totalItems, results] = await Promise.all([
      this.prisma.attendance.count({ where }),
      this.prisma.attendance.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { date: "desc" },
        include: { student: true },
      }),
    ]);

    const items: AttendanceItemResponse[] = results.map((record) => ({
      studentId: record.student.externalId,
      studentName: record.student.name,
      enrollmentId: record.student.enrollmentId,
      course: record.student.courseId,
      attendenceType: record.type,
      attendanceDate: record.date,
    }));

    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      items,
    };
  }
}
