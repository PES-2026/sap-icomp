import { ListReportItemDTO } from "@application/dtos/report/listReportDto";
import { Report } from "@domain/entities/report";
import { IReportRepository } from "@domain/repositories/reportRepository";
import { PrismaClient } from "@prisma/src/infrastructure/database/generated/client";

export class PrismaReportRepository implements IReportRepository {
  constructor(private prisma: PrismaClient) {}

  async save(report: Report): Promise<void> {
    await this.prisma.report.create({
      data: {
        externalId: report.id.value,
        student: { connect: { externalId: report.studentId.value } },
        pedagogue: { connect: { externalId: report.pedagogueId.value } },
        condition: report.condition.value,
        potential: report.potential.value,
        difficulties: report.difficulties.value,
        recommendation: report.recommendation.value,
        conclusion: report.conclusion.value,
      },
    });
  }

  async update(report: Report): Promise<void> {
    await this.prisma.report.update({
      where: { externalId: report.id.value },
      data: {
        condition: report.condition.value,
        potential: report.potential.value,
        difficulties: report.difficulties.value,
        recommendation: report.recommendation.value,
        conclusion: report.conclusion.value,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.report.update({
      where: { externalId: id },
      data: { removed: true },
    });
  }

  async findByStudentId(studentId: string): Promise<ListReportItemDTO[]> {
    const reports = await this.prisma.report.findMany({
      where: { student: { externalId: studentId }, removed: false },
      include: { pedagogue: true },
      orderBy: { createdAt: "desc" },
    });

    return reports.map((report) => ({
      reportId: report.externalId,
      pedagogueId: report.pedagogue.externalId,
      pedagogueName: report.pedagogue.name,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    }));
  }

  async findById(id: string): Promise<any | null> {
    const report = await this.prisma.report.findUnique({
      where: { externalId: id, removed: false },
      include: {
        student: {
          include: {
            course: true,
          },
        },
        pedagogue: true,
      },
    });

    if (!report) {
      return null;
    }

    return {
      student: {
        name: report.student.name,
        enrollmentId: report.student.enrollmentId,
        courseName: report.student.course.name,
      },
      pedagogueName: report.pedagogue.name,
      pedagogueId: report.pedagogue.externalId,
      condition: report.condition,
      potential: report.potential,
      difficulties: report.difficulties,
      recommendation: report.recommendation,
      conclusion: report.conclusion,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    };
  }

  async findByIdWithDetails(id: string): Promise<any | null> {
    const report = await this.prisma.report.findUnique({
      where: { externalId: id, removed: false },
      include: {
        student: {
          include: {
            course: true,
          },
        },
        pedagogue: true,
      },
    });

    if (!report) {
      return null;
    }

    return {
      reportExternalId: report.externalId,
      student: {
        externalId: report.student.externalId,
        name: report.student.name,
        enrollmentId: report.student.enrollmentId,
        courseName: report.student.course.name,
      },
      pedagogue: {
        externalId: report.pedagogue.externalId,
        name: report.pedagogue.name,
      },
      condition: report.condition,
      potential: report.potential,
      difficulties: report.difficulties,
      recommendation: report.recommendation,
      conclusion: report.conclusion,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    };
  }
  async findPedagoguePasswordByReportId(reportId: string): Promise<string | null> {
    const report = await this.prisma.report.findUnique({
      where: {
        externalId: reportId,
        removed: false,
      },
      select: {
        pedagogue: {
          select: {
            password: true,
          },
        },
      },
    });
    if (!report) {
      return null;
    }
    if (!report.pedagogue.password) {
      return null;
    }
    return report.pedagogue.password;
  }

  async existsById(id: string): Promise<boolean> {
    const report = await this.prisma.report.findUnique({
      where: {
        externalId: id,
        removed: false,
      },
      select: {
        internalId: true,
      },
    });

    return report !== null;
  }
}
