import { prisma } from "./prisma.js";

async function main() {
  await prisma.course.createMany({
    data: [
      { id: "Engenharia de Software", name: "Engenharia de Software" },
      { id: "Ciência da Computação", name: "Ciência da Computação" },
      { id: "A.B.I", name: "A.B.I" },
      { id: "Sistemas de Informação", name: "Sistemas de Informação" },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => console.log("Seed executado com sucesso"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
