import "dotenv/config";

import cors from "cors";
import express from "express";

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
import { prisma } from "@infrastructure/persistence/prisma";
import { PrismaAttendanceRepository } from "@infrastructure/persistence/repositories/prismaAttendanceRepository";
import { PrismaAttendanceTypeRepository } from "@infrastructure/persistence/repositories/prismaAttendanceTypeRepository";
import { PrismaCourseRepository } from "@infrastructure/persistence/repositories/prismaCourseRepository";
import { PrismaDiagnosesRepository } from "@infrastructure/persistence/repositories/prismaDiagnosesRepository";
import { PrismaStudentRepository } from "@infrastructure/persistence/repositories/prismaStudentRepository";
import { AttendanceController } from "@presentation/controllers/attendanceController";
import { AttendanceTypeController } from "@presentation/controllers/attendanceTypeController";
import { CourseController } from "@presentation/controllers/courseController";
import { DiagnosesController } from "@presentation/controllers/diagnosesController";
import { StudentController } from "@presentation/controllers/studentController";
import { errorHandler } from "@presentation/middlewares/errorHandler";
import { attendanceRoutes } from "@presentation/routes/attendanceRoutes";
import { attendanceTypeRoutes } from "@presentation/routes/attendanceTypeRoutes";
import { courseRoutes } from "@presentation/routes/courseRoutes";
import { diagnosesRoutes } from "@presentation/routes/diagnosesRoutes";
import { studentRoutes } from "@presentation/routes/studentRoutes";

const app = express();
app.use(express.json());

const allowedOrigins = [
  `https://${process.env.FRONTEND_HOST}`,
  `http://${process.env.FRONTEND_HOST}`,
  `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`,
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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

const attedanceRepository = new PrismaAttendanceRepository(prisma);
const studentRepository = new PrismaStudentRepository(prisma);

const attendanceControler = new AttendanceController(
  new CreateAttendance(attedanceRepository, studentRepository),
  new ListAttendances(attedanceRepository),
  new UpdateAttendance(attedanceRepository),
  new AttendancesByStudent(attedanceRepository),
  new RemoveAttendance(attedanceRepository),
  new AttendanceById(attedanceRepository),
);

app.use(attendanceRoutes(attendanceControler));

const studentController = new StudentController(
  new CreateStudent(studentRepository),
  new ListStudents(studentRepository),
  new UpdateStudent(studentRepository),
  new StudentById(studentRepository),
  new RemoveStudent(studentRepository),
);

app.use(studentRoutes(studentController));

const diagnosesRepository = new PrismaDiagnosesRepository(prisma);

const diagnosesController = new DiagnosesController(
  new CreateDiagnosis(diagnosesRepository),
  new UpdateDiagnosis(diagnosesRepository),
  new ListDiagnoses(diagnosesRepository),
  new RemoveDiagnosis(diagnosesRepository),
  new DiagnosisById(diagnosesRepository),
);

app.use(diagnosesRoutes(diagnosesController));

const courseRepository = new PrismaCourseRepository(prisma);

const courseController = new CourseController(
  new CreateCourse(courseRepository),
  new UpdateCourse(courseRepository),
  new ListCourse(courseRepository),
  new CourseById(courseRepository),
  new RemoveCourse(courseRepository),
);

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

// Global error handler should be the last middleware registered
app.use(errorHandler);

const PORT = process.env.BACKEND_PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
