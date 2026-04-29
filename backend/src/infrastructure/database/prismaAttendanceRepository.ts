import {
  PrismaClient,
  Prisma,
} from "../../../prisma/src/infrastructure/database/generated/client";
import {
  AttendancesByStudentRequest,
  AttendancesByStudentResponse,
} from "../../application/dtos/attendance/attendancesByStudent.dto";
import {
  AttendanceItemResponse,
  ListAttendanceRequest,
  ListAttendanceResponse,
} from "../../application/dtos/attendance/listAttendance.dto";
import { Attendance } from "../../domain/entities/attendance";
import { IAttendanceRepository } from "../../domain/repositories/attendanceRepository";
import { AttendanceTypeVO } from "../../domain/valueObjects/attendance/attendanceType";
import { DemandVO } from "../../domain/valueObjects/attendance/demand";
import { GeneralObservationsVO } from "../../domain/valueObjects/attendance/generalObservations";
import { DateVO } from "../../domain/valueObjects/shared/date";
import { ExternalIdVO } from "../../domain/valueObjects/shared/externalId";
import { StudentId } from "../../domain/valueObjects/student/studentId";

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
      removed: false,
      ...(filters.studentName && {
        student: {
          name: { contains: filters.studentName, mode: "insensitive" },
        },
      }),
      ...(filters.studentCourse && {
        student: {
          course: {
            name: { contains: filters.studentCourse, mode: "insensitive" },
          },
        },
      }),
      ...(filters.studentEnrollment && {
        student: {
          enrollmentId: { contains: filters.studentEnrollment },
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
        include: { student: { include: { course: true } } },
      }),
    ]);

    const items: AttendanceItemResponse[] = results.map((record) => ({
      studentId: record.student.externalId,
      studentName: record.student.name,
      enrollmentId: record.student.enrollmentId,
      course: record.student.courseId,
      attendanceType: record.type,
      attendanceDate: record.date,
    }));

    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      items,
    };
  }

  async findById(id: string): Promise<Attendance | null> {
    const attendance = await this.prisma.attendance.findUnique({
      where: { externalId: id, removed: false },
    });

    if (!attendance) return null;

    return new Attendance(
      ExternalIdVO.from(attendance.externalId),
      StudentId.reutilise(attendance.studentId),
      DateVO.create(attendance.date),
      AttendanceTypeVO.create(attendance.type),
      DemandVO.create(attendance.demand),
      attendance.generalObservations
        ? GeneralObservationsVO.create(attendance.generalObservations)
        : undefined,
    );
  }

  async update(attendance: Attendance): Promise<void> {
    await this.prisma.attendance.update({
      where: { externalId: attendance.id.value },
      data: {
        type: attendance.type.value,
        date: attendance.date.value,
        demand: attendance.demand.value,
        generalObservations: attendance.generalObservations?.value ?? "",
      },
    });
  }

  async findByStudentId(
    params: AttendancesByStudentRequest,
  ): Promise<AttendancesByStudentResponse | null> {
    const { page, limit, studentId } = params;
    const offset = (page - 1) * limit;

    const where: Prisma.AttendanceWhereInput = {
      student: {
        externalId: studentId,
      },
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
      attendanceType: record.type,
      attendanceDate: record.date,
    }));

    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      items,
    };
  }

  async remove(id: string): Promise<void> {
    await this.prisma.attendance.update({
      where: { externalId: id },
      data: { removed: true },
    });
  }
}
