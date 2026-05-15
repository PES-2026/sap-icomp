import "dotenv/config";

import cors from "cors";
import express from "express";

import { AttendanceById } from "@application/useCases/attendance/attendanceById";
import { AttendancesByStudent } from "@application/useCases/attendance/attendanceByStudent";
import { CreateAttendance } from "@application/useCases/attendance/createAttendance";
import { ListAttendances } from "@application/useCases/attendance/listAttendances";
import { RemoveAttendance } from "@application/useCases/attendance/removeAttendance";
import { UpdateAttendance } from "@application/useCases/attendance/updateAttendance";
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
import { CreateTypeAttendance } from "@application/useCases/typeAttendance/createTypeAttendance";
import { ListTypeAttendances } from "@application/useCases/typeAttendance/listTypeAttendances";
import { RemoveTypeAttendance } from "@application/useCases/typeAttendance/removeTypeAttendance";
import { TypeAttendanceById } from "@application/useCases/typeAttendance/typeAttendanceById";
import { UpdateTypeAttendance } from "@application/useCases/typeAttendance/updateTypeAttendance";
import { prisma } from "@infrastructure/persistence/prisma";
import { PrismaAttendanceRepository } from "@infrastructure/persistence/repositories/prismaAttendanceRepository";
import { PrismaCourseRepository } from "@infrastructure/persistence/repositories/prismaCourseRepository";
import { PrismaDiagnosesRepository } from "@infrastructure/persistence/repositories/prismaDiagnosesRepository";
import { PrismaStudentRepository } from "@infrastructure/persistence/repositories/prismaStudentRepository";
import { PrismaTypeAttendanceRepository } from "@infrastructure/persistence/repositories/prismaTypeAttendanceRepository";
import { AttendanceController } from "@presentation/controllers/attendanceController";
import { CourseController } from "@presentation/controllers/courseController";
import { DiagnosesController } from "@presentation/controllers/diagnosesController";
import { StudentController } from "@presentation/controllers/studentController";
import { TypeAttendanceController } from "@presentation/controllers/typeAttendanceController";
import { errorHandler } from "@presentation/middlewares/errorHandler";
import { attendanceRoutes } from "@presentation/routes/attendanceRoutes";
import { courseRoutes } from "@presentation/routes/courseRoutes";
import { diagnosesRoutes } from "@presentation/routes/diagnosesRoutes";
import { studentRoutes } from "@presentation/routes/studentRoutes";
import { typeAttendanceRoutes } from "@presentation/routes/typeAttendanceRoutes";

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

const typeAttendanceRepository = new PrismaTypeAttendanceRepository(prisma);

const typeAttendanceControler = new TypeAttendanceController(
  new CreateTypeAttendance(typeAttendanceRepository),
  new UpdateTypeAttendance(typeAttendanceRepository),
  new ListTypeAttendances(typeAttendanceRepository),
  new RemoveTypeAttendance(typeAttendanceRepository),
  new TypeAttendanceById(typeAttendanceRepository),
);

app.use(typeAttendanceRoutes(typeAttendanceControler));

// Global error handler should be the last middleware registered
app.use(errorHandler);

const PORT = process.env.BACKEND_PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
