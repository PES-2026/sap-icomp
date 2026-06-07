import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prisma } from "@infrastructure/persistence/prisma";
import { PrismaAttendanceRepository } from "@infrastructure/persistence/repositories/prismaAttendanceRepository";
import { PrismaStudentRepository } from "@infrastructure/persistence/repositories/prismaStudentRepository";
import { PrismaPedagogueRepository } from "@infrastructure/persistence/repositories/prismaPedagogueRepository";
import { PrismaScheduleSlotRepository } from "@infrastructure/persistence/repositories/prismaScheduleSlotRepository";
import { PrismaAttendanceTypeRepository } from "@infrastructure/persistence/repositories/prismaAttendanceTypeRepository";
import { PrismaCourseRepository } from "@infrastructure/persistence/repositories/prismaCourseRepository";
import { ConsoleEmailService } from "@infrastructure/services/consoleEmailService";
import { RequestAttendance } from "@application/useCases/schedule/requestAttendance";
import { PublicAttendanceController } from "../controllers/publicAttendanceController";

const publicAttendanceRoutes = Router();

// Repositories
const attendanceRepo = new PrismaAttendanceRepository(prisma);
const studentRepo = new PrismaStudentRepository(prisma);
const pedagogueRepo = new PrismaPedagogueRepository(prisma);
const slotRepo = new PrismaScheduleSlotRepository(prisma);
const typeRepo = new PrismaAttendanceTypeRepository(prisma);
const courseRepo = new PrismaCourseRepository(prisma);

// Service
const emailService = new ConsoleEmailService();

// Use Case
const requestAttendanceUseCase = new RequestAttendance(
  attendanceRepo,
  studentRepo,
  pedagogueRepo,
  slotRepo,
  typeRepo,
  courseRepo,
  emailService,
);

// Controller
const controller = new PublicAttendanceController(requestAttendanceUseCase);

// Rate Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Muitas solicitações de agendamento. Tente novamente em 15 minutos." },
});

publicAttendanceRoutes.post("/public/attendances/request", limiter, (req, res) => controller.handleRequest(req, res));

export { publicAttendanceRoutes };
