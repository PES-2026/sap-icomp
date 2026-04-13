import express from "express";
import { prisma } from "../infrastructure/database/prisma.js";
import { PrismaStudentRepository } from "../infrastructure/database/prismaStudentRepository.js";
import {
  CpfAlreadyExistsError,
  RegisterStudent,
  StudentRoleNotFoundError,
} from "../domain/use-cases/register-student.js";

const app = express();
app.use(express.json());

const studentRepository = new PrismaStudentRepository(prisma);
const registerStudent = new RegisterStudent(studentRepository);

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Fail to retrieve users" });
  }
});

app.post("/students", async (req, res) => {
  try {
    const { name, cpf, dtBirth, email } = req.body as {
      name?: string;
      cpf?: string;
      dtBirth?: string;
      email?: string;
    };

    if (!name || !cpf || !dtBirth || !email) {
      return res.status(400).json({
        error:
          "Os atributos Nome, CPF, Data de Nascimento e Email são obrigatórios",
      });
    }

    await registerStudent.execute({ name, cpf, dtBirth, email });

    return res.status(201).json({
      message: "Aluno cadastrado com sucesso",
    });
  } catch (error) {
    if (error instanceof CpfAlreadyExistsError) {
      return res.status(409).json({ error: error.message });
    }

    if (error instanceof StudentRoleNotFoundError) {
      return res.status(500).json({ error: error.message });
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
