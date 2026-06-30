/*
  Warnings:

  - Added the required column `difficulties` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `potential` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Made the column `condition` on table `Report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `recommendation` on table `Report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `conclusion` on table `Report` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "difficulties" TEXT NOT NULL,
ADD COLUMN     "potential" TEXT NOT NULL,
ALTER COLUMN "condition" SET NOT NULL,
ALTER COLUMN "recommendation" SET NOT NULL,
ALTER COLUMN "conclusion" SET NOT NULL;
