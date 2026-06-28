import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { ApproveAccountRequest } from "@application/useCases/accountRequest/approveAccountRequest";
import { CreateAccountRequest } from "@application/useCases/accountRequest/createAccountRequest";
import { ListPendingAccountRequests } from "@application/useCases/accountRequest/listPendingAccountRequests";
import { AttendanceById } from "@application/useCases/attendance/attendanceById";
import { AttendancesByStudent } from "@application/useCases/attendance/attendanceByStudent";
import { CreateAttendance } from "@application/useCases/attendance/createAttendance";
import { ListAttendances } from "@application/useCases/attendance/listAttendances";
import { RemoveAttendance } from "@application/useCases/attendance/removeAttendance";
import { UpdateAttendance } from "@application/useCases/attendance/updateAttendance";
import { AttendanceTypeById } from "@application/useCases/attendanceType/attendanceTypeById";
import { CreateAttendanceType } from "@application/useCases/attendanceType/createAttendanceType";
import { ListAttendanceTypes } from "@application/useCases/attendanceType/listAttendanceType";
import { RemoveAttendanceType } from "@application/useCases/attendanceType/removeAttendanceType";
import { UpdateAttendanceType } from "@application/useCases/attendanceType/updateAttendanceType";
import { CourseById } from "@application/useCases/course/courseById";
import { CreateCourse } from "@application/useCases/course/createCourse";
import { ListCourse } from "@application/useCases/course/listCourse";
import { RemoveCourse } from "@application/useCases/course/removeCourse";
import { UpdateCourse } from "@application/useCases/course/updateCourse";
import { CreateDiagnosis } from "@application/useCases/diagnoses/createDiagnosis";
import { DiagnosisById } from "@application/useCases/diagnoses/diagnosisById";
import { ListDiagnoses } from "@application/useCases/diagnoses/listDiagnoses";
import { RemoveDiagnosis } from "@application/useCases/diagnoses/removeDiagnosis";
import { UpdateDiagnosis } from "@application/useCases/diagnoses/updateDiagnosis";
import { CancelSchedule } from "@application/useCases/schedule/cancelSchedule";
import { CancelScheduleByToken } from "@application/useCases/schedule/cancelScheduleByToken";
import { ConfirmSchedule } from "@application/useCases/schedule/confirmSchedule";
import { CreateScheduleAvailability } from "@application/useCases/schedule/createScheduleAvailability";
import { GetWeekdayFromDate } from "@application/useCases/schedule/getWeekdayFromDate";
import { ListScheduleAvailability } from "@application/useCases/schedule/listScheduleAvailability";
import { ListSchedules } from "@application/useCases/schedule/listSchedules";
import { PreviewScheduleAvailability } from "@application/useCases/schedule/previewScheduleAvailability";
import { RemoveManyScheduleSlots } from "@application/useCases/schedule/removeManyScheduleSlots";
import { RemoveScheduleSlot } from "@application/useCases/schedule/removeScheduleSlot";
import { RequestSchedule } from "@application/useCases/schedule/requestSchedule";
import { RescheduleSchedule } from "@application/useCases/schedule/rescheduleSchedule";
import { RescheduleScheduleByToken } from "@application/useCases/schedule/rescheduleScheduleByToken";
import { CreateStudent } from "@application/useCases/student/createStudent";
import { ListStudents } from "@application/useCases/student/listStudents";
import { RemoveStudent } from "@application/useCases/student/removeStudent";
import { StudentById } from "@application/useCases/student/studentById";
import { UpdateStudent } from "@application/useCases/student/updateStudent";
import { ActivateUser } from "@application/useCases/user/activateUser";
import { AuthenticateUser } from "@application/useCases/user/authenticateUser";
import { GetAuthenticatedUser } from "@application/useCases/user/getAuthenticatedUser";
import { GetUserById } from "@application/useCases/user/getUserById";
import { ListUsers } from "@application/useCases/user/listUsers";
import { RemoveUser } from "@application/useCases/user/removeUser";
import { RequestPasswordReset } from "@application/useCases/user/requestPasswordReset";
import { ResetPassword } from "@application/useCases/user/resetPassword";
import { UpdateUser } from "@application/useCases/user/updateUser";
import { UpdateUserPassword } from "@application/useCases/user/updateUserPassword";
import { UserResolver } from "@application/useCases/user/userResolver";
import { env } from "@infrastructure/config/env";
import { prisma } from "@infrastructure/persistence/prisma";
import { PrismaAccountRequestRepository } from "@infrastructure/persistence/repositories/prismaAccountRequestRepository";
import { PrismaAttendanceRepository } from "@infrastructure/persistence/repositories/prismaAttendanceRepository";
import { PrismaAttendanceTypeRepository } from "@infrastructure/persistence/repositories/prismaAttendanceTypeRepository";
import { PrismaCourseRepository } from "@infrastructure/persistence/repositories/prismaCourseRepository";
import { PrismaDiagnosesRepository } from "@infrastructure/persistence/repositories/prismaDiagnosesRepository";
import { PrismaPasswordResetRepository } from "@infrastructure/persistence/repositories/prismaPasswordResetRepository";
import { PrismaPedagogueRepository } from "@infrastructure/persistence/repositories/prismaPedagogueRepository";
import { PrismaProfessorRepository } from "@infrastructure/persistence/repositories/prismaProfessorRepository";
import { PrismaScheduleRepository } from "@infrastructure/persistence/repositories/prismaScheduleRepository";
import { PrismaScheduleSlotRepository } from "@infrastructure/persistence/repositories/prismaScheduleSlotRepository";
import { PrismaStudentRepository } from "@infrastructure/persistence/repositories/prismaStudentRepository";
import { BcryptHashService } from "@infrastructure/services/bcryptHashService";
import { EmailService } from "@infrastructure/services/email/providers/gmailService";
import { JwtTokenService } from "@infrastructure/services/jwtTokenService";
import { AccountRequestController } from "@presentation/controllers/accountRequestController";
import { AttendanceController } from "@presentation/controllers/attendanceController";
import { AttendanceTypeController } from "@presentation/controllers/attendanceTypeController";
import { AuthController } from "@presentation/controllers/authController";
import { CourseController } from "@presentation/controllers/courseController";
import { DiagnosesController } from "@presentation/controllers/diagnosesController";
import { ScheduleController } from "@presentation/controllers/scheduleController";
import { StudentController } from "@presentation/controllers/studentController";
import { UserController } from "@presentation/controllers/userController";
import { errorHandler } from "@presentation/middlewares/errorHandler";
import { accountRequestRoutes } from "@presentation/routes/accountRequestRoutes";
import { attendanceRoutes } from "@presentation/routes/attendanceRoutes";
import { attendanceTypeRoutes } from "@presentation/routes/attendanceTypeRoutes";
import { authRoutes } from "@presentation/routes/authRoutes";
import { courseRoutes } from "@presentation/routes/courseRoutes";
import { diagnosesRoutes } from "@presentation/routes/diagnosesRoutes";
import { scheduleRoutes } from "@presentation/routes/scheduleRoutes";
import { studentRoutes } from "@presentation/routes/studentRoutes";
import { GetReportInitialData } from "@application/useCases/report/getReportInitialData";
import { ReportController } from "@presentation/controllers/reportController";
import { userRoutes } from "@presentation/routes/userRoutes";
import { PrismaReportRepository } from "@infrastructure/persistence/repositories/prismaReportRepository";
import { reportRoutes } from "@presentation/routes/reportRoutes";
import { CreateReport } from "@application/useCases/report/createReport";
import { GetReportById } from "@application/useCases/report/getReportById";
import { ListReportsByStudent } from "@application/useCases/report/listReportsByStudent";
import { UpdateReport } from "@application/useCases/report/updateReport";
import { RemoveReport } from "@application/useCases/report/removeReport";

const app = express();
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(express.json());

const allowedOrigins = [
  `https://${env.FRONTEND_HOST}`,
  `http://${env.FRONTEND_HOST}`,
  `http://${env.FRONTEND_HOST}:${env.FRONTEND_PORT}`,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  }),
);

const courseRepository = new PrismaCourseRepository(prisma);

const courseController = new CourseController(
  new CreateCourse(courseRepository),
  new UpdateCourse(courseRepository),
  new ListCourse(courseRepository),
  new CourseById(courseRepository),
  new RemoveCourse(courseRepository),
);

const studentRepository = new PrismaStudentRepository(prisma);
const studentController = new StudentController(
  new CreateStudent(studentRepository),
  new ListStudents(studentRepository),
  new UpdateStudent(studentRepository),
  new StudentById(studentRepository),
  new RemoveStudent(studentRepository),
);

app.use(studentRoutes(studentController));

app.use(courseRoutes(courseController));

const attendanceTypeRepository = new PrismaAttendanceTypeRepository(prisma);

const attendanceTypeController = new AttendanceTypeController(
  new CreateAttendanceType(attendanceTypeRepository),
  new UpdateAttendanceType(attendanceTypeRepository),
  new ListAttendanceTypes(attendanceTypeRepository),
  new RemoveAttendanceType(attendanceTypeRepository),
  new AttendanceTypeById(attendanceTypeRepository),
);

app.use(attendanceTypeRoutes(attendanceTypeController));

const accountRequestRepository = new PrismaAccountRequestRepository(prisma);
const professorRepository = new PrismaProfessorRepository(prisma);
const pedagogueRepository = new PrismaPedagogueRepository(prisma);
const hashService = new BcryptHashService();

const accountRequestController = new AccountRequestController(
  new CreateAccountRequest(accountRequestRepository, pedagogueRepository, professorRepository, hashService),
  new ApproveAccountRequest(accountRequestRepository, pedagogueRepository, professorRepository),
  new ListPendingAccountRequests(accountRequestRepository),
);

app.use(accountRequestRoutes(accountRequestController));

const userController = new UserController(
  new ListUsers(pedagogueRepository, professorRepository),
  new UpdateUser(pedagogueRepository, professorRepository, studentRepository),
  new UpdateUserPassword(pedagogueRepository, professorRepository, hashService),
  new GetUserById(pedagogueRepository, professorRepository),
  new RemoveUser(pedagogueRepository, professorRepository),
  new ActivateUser(pedagogueRepository, professorRepository),
);

app.use(userRoutes(userController));

const tokenService = new JwtTokenService();
const emailService = new EmailService();
const passwordResetRepository = new PrismaPasswordResetRepository();
const userResolver = new UserResolver(professorRepository, pedagogueRepository);
const authenticateUserUseCase = new AuthenticateUser(userResolver, hashService, tokenService);
const getAuthenticatedUserUseCase = new GetAuthenticatedUser(userResolver);
const requestPasswordResetUseCase = new RequestPasswordReset(userResolver, emailService, passwordResetRepository);
const resetPasswordUseCase = new ResetPassword(
  hashService,
  professorRepository,
  pedagogueRepository,
  passwordResetRepository,
);

const authController = new AuthController(
  authenticateUserUseCase,
  getAuthenticatedUserUseCase,
  requestPasswordResetUseCase,
  resetPasswordUseCase,
);

app.use(authRoutes(authController, tokenService));

const attendanceRepository = new PrismaAttendanceRepository(prisma);
const attendanceController = new AttendanceController(
  new CreateAttendance(attendanceRepository, studentRepository),
  new ListAttendances(attendanceRepository),
  new UpdateAttendance(attendanceRepository),
  new AttendancesByStudent(attendanceRepository),
  new RemoveAttendance(attendanceRepository),
  new AttendanceById(attendanceRepository),
);

app.use(attendanceRoutes(attendanceController));

const diagnosisRepository = new PrismaDiagnosesRepository(prisma);
const diagnosesController = new DiagnosesController(
  new CreateDiagnosis(diagnosisRepository),
  new UpdateDiagnosis(diagnosisRepository),
  new ListDiagnoses(diagnosisRepository),
  new RemoveDiagnosis(diagnosisRepository),
  new DiagnosisById(diagnosisRepository),
);

app.use(diagnosesRoutes(diagnosesController));

const reportRepository = new PrismaReportRepository(prisma);
const reportController = new ReportController(
  new GetReportInitialData(studentRepository),
  new CreateReport(reportRepository, attendanceRepository),
  new UpdateReport(reportRepository),
  new RemoveReport(reportRepository, hashService),
  new ListReportsByStudent(reportRepository),
  new GetReportById(reportRepository),
);
app.use(reportRoutes(reportController, tokenService));

const scheduleSlotRepository = new PrismaScheduleSlotRepository(prisma);

const scheduleRepository = new PrismaScheduleRepository(prisma);

const getWeekdayFromDateUseCase = new GetWeekdayFromDate();
const previewScheduleAvailabilityUseCase = new PreviewScheduleAvailability(
  scheduleSlotRepository,
  getWeekdayFromDateUseCase,
);
const createScheduleAvailabilityUseCase = new CreateScheduleAvailability(
  scheduleSlotRepository,
  pedagogueRepository,
  getWeekdayFromDateUseCase,
);

const listScheduleSlotsUseCase = new ListScheduleAvailability(scheduleSlotRepository);

const listSchedulesUseCase = new ListSchedules(scheduleRepository);

const removeScheduleSlotUseCase = new RemoveScheduleSlot(scheduleSlotRepository);

const removeManyScheduleSlotsUseCase = new RemoveManyScheduleSlots(scheduleSlotRepository);

const confirmScheduleUseCase = new ConfirmSchedule(
  scheduleRepository,
  pedagogueRepository,
  studentRepository,
  emailService,
);

const cancelScheduleUseCase = new CancelSchedule(
  scheduleRepository,
  scheduleSlotRepository,
  pedagogueRepository,
  studentRepository,
  emailService,
);

const rescheduleScheduleUseCase = new RescheduleSchedule(
  scheduleRepository,
  scheduleSlotRepository,
  pedagogueRepository,
  studentRepository,
  emailService,
  env.FRONTEND_URL,
);

const cancelScheduleByTokenUseCase = new CancelScheduleByToken(
  scheduleRepository,
  scheduleSlotRepository,
  pedagogueRepository,
  studentRepository,
  emailService,
);

const rescheduleScheduleByTokenUseCase = new RescheduleScheduleByToken(
  scheduleRepository,
  scheduleSlotRepository,
  pedagogueRepository,
  studentRepository,
  emailService,
  env.FRONTEND_URL,
);

const requestScheduleUseCase = new RequestSchedule(
  scheduleRepository,
  pedagogueRepository,
  studentRepository,
  scheduleSlotRepository,
  courseRepository,
  emailService,
);

const scheduleController = new ScheduleController(
  previewScheduleAvailabilityUseCase,
  createScheduleAvailabilityUseCase,
  requestScheduleUseCase,
  listScheduleSlotsUseCase,
  removeScheduleSlotUseCase,
  removeManyScheduleSlotsUseCase,
  listSchedulesUseCase,
  confirmScheduleUseCase,
  cancelScheduleUseCase,
  rescheduleScheduleUseCase,
  cancelScheduleByTokenUseCase,
  rescheduleScheduleByTokenUseCase,
);

app.use(scheduleRoutes(scheduleController, tokenService));

// Global error handler should be the last middleware registered
app.use(errorHandler);

const PORT = env.BACKEND_PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
