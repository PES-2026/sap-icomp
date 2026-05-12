import "dotenv/config";

import cors from "cors";
import express from "express";

import { AttendanceById } from "@application/useCases/attendance/attendanceById";
import { AttendancesByStudent } from "@application/useCases/attendance/attendanceByStudent";
import { CreateAttendance } from "@application/useCases/attendance/createAttendance";
import { ListAttendances } from "@application/useCases/attendance/listAttendances";
import { RemoveAttendance } from "@application/useCases/attendance/removeAttendance";
import { UpdateAttendance } from "@application/useCases/attendance/updateAttendance";
import { CreateStudent } from "@application/useCases/student/createStudent";
import { ListStudents } from "@application/useCases/student/listStudents";
import { RemoveStudent } from "@application/useCases/student/removeStudent";
import { StudentById } from "@application/useCases/student/studentById";
import { UpdateStudent } from "@application/useCases/student/updateStudent";
import { prisma } from "@infrastructure/database/prisma";
import { PrismaAttendanceRepository } from "@infrastructure/database/prismaAttendanceRepository";
import { PrismaStudentRepository } from "@infrastructure/database/prismaStudentRepository";

import { AttendanceController } from "./controllers/attendanceController";
import { StudentController } from "./controllers/studentController";
import { attendanceRoutes } from "./routes/attendanceRoutes";
import { studentRoutes } from "./routes/studentRoutes";

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

const attendanceControler = new AttendanceController(
  new CreateAttendance(attedanceRepository),
  new ListAttendances(attedanceRepository),
  new UpdateAttendance(attedanceRepository),
  new AttendancesByStudent(attedanceRepository),
  new RemoveAttendance(attedanceRepository),
  new AttendanceById(attedanceRepository),
);

app.use(attendanceRoutes(attendanceControler));

const studentRepository = new PrismaStudentRepository(prisma);

const studentController = new StudentController(
  new CreateStudent(studentRepository),
  new ListStudents(studentRepository),
  new UpdateStudent(studentRepository),
  new StudentById(studentRepository),
  new RemoveStudent(studentRepository),
);

app.use(studentRoutes(studentController));

const PORT = process.env.BACKEND_PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
