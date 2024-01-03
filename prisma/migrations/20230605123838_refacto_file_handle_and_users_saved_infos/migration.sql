/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ExcelFile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Forms" DROP CONSTRAINT "Forms_excelFileId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "ExcelFile";

-- CreateTable
CREATE TABLE "TemplateFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileAssociation" (
    "id" TEXT NOT NULL,
    "formInputId" TEXT NOT NULL,
    "templateFileId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileAssociation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "FileAssociation" ADD CONSTRAINT "FileAssociation_formInputId_fkey" FOREIGN KEY ("formInputId") REFERENCES "FormInputs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAssociation" ADD CONSTRAINT "FileAssociation_templateFileId_fkey" FOREIGN KEY ("templateFileId") REFERENCES "TemplateFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_excelFileId_fkey" FOREIGN KEY ("excelFileId") REFERENCES "TemplateFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
