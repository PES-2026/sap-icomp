import { PrismaClient } from "./prisma/src/infrastructure/database/generated/client";
import { BcryptHashService } from "./src/infrastructure/services/bcryptHashService";

import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});

const prisma = new PrismaClient({ adapter });
const hashService = new BcryptHashService();

async function main() {
  const senhaCriptografada = await hashService.hash("senha123");

  // Criando um Professor de teste
  await prisma.professor.upsert({
    where: { email: "professor@escola.com" },
    update: {},
    create: {
      externalId: "ext-prof-001",
      registration: "PROF-001",
      name: "Professor Teste",
      email: "professor@escola.com",
      phoneNumber: "92999999999",
      password: senhaCriptografada,
      userStatus: "APPROVED",
      removed: false,
    },
  });

  // Criando um Pedagogo de teste
  await prisma.pedagogue.upsert({
    where: { email: "pedagogo@escola.com" },
    update: {},
    create: {
      externalId: "ext-ped-001",
      registration: "PED-001",
      name: "Pedagogo Teste",
      email: "pedagogo@escola.com",
      phoneNumber: "92988888888",
      password: senhaCriptografada,
      userStatus: "APPROVED",
      removed: false,
    },
  });

  console.log("Usuários de teste criados com sucesso! Senha padrão: senha123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
