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

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      `https://${process.env.FRONTEND_HOST}`,
      `http://${process.env.FRONTEND_HOST}`,
    ],
  }),
);

const studentRepository = new PrismaStudentRepository(prisma);
const registerStudent = new RegisterStudent(studentRepository);
const editStudent = new EditStudent(studentRepository);

app.get("/students", async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    console.log("Retrieved students:", students);
    res.json(students);
  } catch (error) {
    console.log("Error retrieving students:", error);
    res.status(500).json({ error: "Fail to retrieve students" });
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
      course,
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
      course,
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

const PORT = process.env.BACKEND_PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
