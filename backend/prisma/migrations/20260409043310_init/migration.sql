-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "e_mail" TEXT NOT NULL,
    "id_role" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "users_e_mail_key" ON "users"("e_mail");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "user_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
