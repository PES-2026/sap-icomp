/*
  Warnings:

  - Added the required column `password` to the `Pedagogue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Professor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PROFESSOR', 'PEDAGOGUE', 'STUDENT');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ENABLED', 'DISABLED');

-- AlterTable
ALTER TABLE "Pedagogue" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "userStatus" "UserStatus" NOT NULL DEFAULT 'APPROVED';

-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "userStatus" "UserStatus" NOT NULL DEFAULT 'APPROVED';

-- CreateTable
CREATE TABLE "AccountRequest" (
    "internalId" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "registration" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "removed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AccountRequest_pkey" PRIMARY KEY ("internalId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountRequest_externalId_key" ON "AccountRequest"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountRequest_registration_key" ON "AccountRequest"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "AccountRequest_email_key" ON "AccountRequest"("email");
