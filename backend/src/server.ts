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
import { CreateStudent } from "@application/useCases/student/createStudent";
import { ListStudents } from "@application/useCases/student/listStudents";
import { RemoveStudent } from "@application/useCases/student/removeStudent";
import { StudentById } from "@application/useCases/student/studentById";
import { UpdateStudent } from "@application/useCases/student/updateStudent";
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
import { PrismaStudentRepository } from "@infrastructure/persistence/repositories/prismaStudentRepository";
import { BcryptHashService } from "@infrastructure/services/bcryptHashService";
import { EmailService } from "@infrastructure/services/emailService";
import { JwtTokenService } from "@infrastructure/services/jwtTokenService";
import { AccountRequestController } from "@presentation/controllers/accountRequestController";
import { AttendanceController } from "@presentation/controllers/attendanceController";
import { AttendanceTypeController } from "@presentation/controllers/attendanceTypeController";
import { AuthController } from "@presentation/controllers/authController";
import { CourseController } from "@presentation/controllers/courseController";
import { DiagnosesController } from "@presentation/controllers/diagnosesController";
import { StudentController } from "@presentation/controllers/studentController";
import { UserController } from "@presentation/controllers/userController";
import { errorHandler } from "@presentation/middlewares/errorHandler";
import { accountRequestRoutes } from "@presentation/routes/accountRequestRoutes";
import { attendanceRoutes } from "@presentation/routes/attendanceRoutes";
import { attendanceTypeRoutes } from "@presentation/routes/attendanceTypeRoutes";
import { authRoutes } from "@presentation/routes/authRoutes";
import { courseRoutes } from "@presentation/routes/courseRoutes";
import { diagnosesRoutes } from "@presentation/routes/diagnosesRoutes";
import { studentRoutes } from "@presentation/routes/studentRoutes";
import { userRoutes } from "@presentation/routes/userRoutes";

const app = express();
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
const professorRepositoryForCourse = new PrismaProfessorRepository(prisma);

const courseController = new CourseController(
  new CreateCourse(courseRepository),
  new ListCourse(courseRepository),
  new CourseById(courseRepository),
  new RemoveCourse(courseRepository),
  new UpdateCourse(courseRepository, professorRepositoryForCourse),
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
const pedagogueRepository = new PrismaPedagogueRepository(prisma);
const professorRepository = new PrismaProfessorRepository(prisma);
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
  {
    jwtExpires: env.JWT_TOKEN_EXPIRES,
    isProduction: env.NODE_ENV === "production",
  },
);

app.use(authRoutes(authController, tokenService));

const attendanceRepository = new PrismaAttendanceRepository(prisma);
const attendanceController = new AttendanceController(
  new CreateAttendance(attendanceRepository, studentRepository, pedagogueRepository, attendanceTypeRepository),
  new UpdateAttendance(attendanceRepository),
  new ListAttendances(attendanceRepository),
  new AttendancesByStudent(attendanceRepository),
  new RemoveAttendance(attendanceRepository),
  new AttendanceById(attendanceRepository),
);

app.use(attendanceRoutes(attendanceController));

const diagnosisRepository = new PrismaDiagnosesRepository(prisma);
const diagnosesController = new DiagnosesController(
  new CreateDiagnosis(diagnosisRepository),
  new ListDiagnoses(diagnosisRepository),
  new UpdateDiagnosis(diagnosisRepository),
  new RemoveDiagnosis(diagnosisRepository),
  new DiagnosisById(diagnosisRepository),
);

app.use(diagnosesRoutes(diagnosesController));

// Global error handler should be the last middleware registered
app.use(errorHandler);

const PORT = env.BACKEND_PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
