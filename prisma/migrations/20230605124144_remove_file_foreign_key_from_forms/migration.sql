/*
  Warnings:

  - You are about to drop the column `excelFileId` on the `Forms` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Forms" DROP CONSTRAINT "Forms_excelFileId_fkey";

-- AlterTable
ALTER TABLE "Forms" DROP COLUMN "excelFileId";
