/*
  Warnings:

  - You are about to drop the column `approved` on the `Pedagogue` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `Pedagogue` table. All the data in the column will be lost.
  - You are about to drop the column `approved` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `Professor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pedagogue" DROP COLUMN "approved",
DROP COLUMN "enabled";

-- AlterTable
ALTER TABLE "Professor" DROP COLUMN "approved",
DROP COLUMN "enabled";

-- CreateTable
CREATE TABLE "PasswordReset" (
    "internalId" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" TIMESTAMP(3),
    "professorId" INTEGER,
    "pedagogueId" INTEGER,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("internalId")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_token_key" ON "PasswordReset"("token");

-- CreateIndex
CREATE INDEX "PasswordReset_token_idx" ON "PasswordReset"("token");

-- AddForeignKey
ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("internalId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_pedagogueId_fkey" FOREIGN KEY ("pedagogueId") REFERENCES "Pedagogue"("internalId") ON DELETE SET NULL ON UPDATE CASCADE;
