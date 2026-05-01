import "dotenv/config";
import express from "express";
import { prisma } from "../infrastructure/database/prisma.js";
import { PrismaStudentRepository } from "../infrastructure/database/prismaStudentRepository.js";
import {
  EmailAlreadyExistsError,
  EnrollmentAlreadyExistsError,
  RegisterStudent,
} from "../application/use-cases/register-student.js";
import { EditStudent } from "../application/use-cases/edit-student.js";
import cors from "cors";
import { attendanceRoutes } from "./routes/attendanceRoutes.js";
import { AttendanceController } from "./controllers/attendanceController.js";
import { CreateAttendance } from "../application/use-cases/attendance/createAttendance.js";
import { PrismaAttendanceRepository } from "../infrastructure/database/prismaAttendanceRepository.js";
import { DisableStudent } from "../application/use-cases/disable-student.js";
import { ListAttendances } from "../application/use-cases/attendance/listAttendances.js";
import { UpdateAttendance } from "../application/use-cases/attendance/updateAttendance.js";
import { AttendancesByStudent } from "../application/use-cases/attendance/attendanceByStudent.js";
import { RemoveAttendance } from "../application/use-cases/attendance/removeAttendance.js";
import { AttendanceById } from "../application/use-cases/attendance/attendanceById.dto.js";

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

const studentRepository = new PrismaStudentRepository(prisma);
const registerStudent = new RegisterStudent(studentRepository);
const editStudent = new EditStudent(studentRepository);
const attedanceRepository = new PrismaAttendanceRepository(prisma);
const disableStudent = new DisableStudent(studentRepository);

app.get("/students", async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      where: { removed: false },
    });
    console.log("Retrieved students:", students);
    res.json(students);
  } catch (error) {
    console.log("Error retrieving students:", error);
    res.status(500).json({ error: "Fail to retrieve students" });
  }
});

app.get("/students/:id", async (req, res) => {
  try {
    const student = await prisma.student.findFirst({
      where: { externalId: req.params.id, removed: false },
    });
    if (!student) {
      throw new Error("Student not found");
    }
    res.status(200).json(student);
  } catch (error) {
    res.json(500).json({ message: "Student not found" });
  }
});

app.post("/student", async (req, res) => {
  try {
    const {
      name,
      dtBirth,
      email,
      enrollmentId,
      phoneNumber,
      courseId,
      diagnosis,
      potential,
      difficulties,
    } = req.body as {
      name?: string;
      dtBirth?: string;
      email?: string;
      enrollmentId?: string;
      phoneNumber?: string;
      courseId?: string;
      diagnosis?: string;
      potential?: string;
      difficulties?: string;
    };

    if (
      !name ||
      !dtBirth ||
      !email ||
      !enrollmentId ||
      !phoneNumber ||
      !courseId
    ) {
      console.log("Missing required fields:", {
        name,
        dtBirth,
        email,
        enrollmentId,
        phoneNumber,
        courseId,
      });
      return res.status(400).json({
        error:
          "Nome, Data de Nascimento, Email, Matrícula, Número de Telefone e Curso são obrigatórios",
      });
    }

    // Os 3 ultimos atributos precisan estar explicitos que podem retornar ""
    // senão pode retornar undefined
    await registerStudent.execute({
      name,
      dtBirth,
      email,
      enrollmentId,
      phoneNumber,
      courseId,
      diagnosis: diagnosis ?? "",
      potential: potential ?? "",
      difficulties: difficulties ?? "",
    });

    return res.status(201).json({
      message: "Aluno cadastrado com sucesso",
    });
  } catch (error) {
    if (
      error instanceof EmailAlreadyExistsError ||
      error instanceof EnrollmentAlreadyExistsError
    ) {
      console.log("Conflict error:", error.message);
      return res.status(409).json({ error: error.message });
    }
    if (error instanceof Error) {
      console.log("Validation error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    console.log("Unexpected error:", error);
    return res.status(500).json({ error: "Failure to register a student" });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    const externalId = req.params.id;

    const {
      name,
      enrollmentId,
      dtBirth,
      email,
      phoneNumber,
      courseId,
      diagnosis,
      potential,
      difficulties,
    } = req.body;

    const result = await editStudent.execute({
      externalId,
      name,
      enrollmentId,
      dtBirth,
      email,
      phoneNumber,
      courseId,
      diagnosis,
      potential,
      difficulties,
    });
    console.log("Student updated successfully:", result);
    return res.status(200).json(result);
  } catch (err: any) {
    console.log("Error updating student:", err);
    return res.status(400).json({ message: err.message });
  }
});

const attendanceControler = new AttendanceController(
  new CreateAttendance(attedanceRepository),
  new ListAttendances(attedanceRepository),
  new UpdateAttendance(attedanceRepository),
  new AttendancesByStudent(attedanceRepository),
  new RemoveAttendance(attedanceRepository),
  new AttendanceById(attedanceRepository),
);

app.use(attendanceRoutes(attendanceControler));
app.delete("/students/:id", async (req, res) => {
  try {
    const externalId = req.params.id;

    const result = await disableStudent.execute(externalId);
    console.log("Student successfully deactivated.");
    return res.status(200).json(result);
  } catch (err: any) {
    console.log("Error deactivating student: ", err);
    return res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.BACKEND_PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
