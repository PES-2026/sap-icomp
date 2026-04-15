import express from "express";
import { prisma } from "../infrastructure/database/prisma.js";
import { PrismaStudentRepository } from "../infrastructure/database/prismaStudentRepository.js";
import {
  EmailAlreadyExistsError,
  EnrollmentAlreadyExistsError,
  RegisterStudent,
} from "../application/use-cases/register-student.js";

const app = express();
app.use(express.json());

const studentRepository = new PrismaStudentRepository(prisma);
const registerStudent = new RegisterStudent(studentRepository);

app.get("/students", async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Fail to retrieve students" });
  }
});

app.post("/students", async (req, res) => {
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
      return res.status(409).json({ error: error.message });
    }
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failure to register a student" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
