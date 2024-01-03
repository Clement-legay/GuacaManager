/*
  Warnings:

  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FileAssociation" DROP CONSTRAINT "FileAssociation_formInputId_fkey";

-- DropForeignKey
ALTER TABLE "FileAssociation" DROP CONSTRAINT "FileAssociation_templateFileId_fkey";

-- DropForeignKey
ALTER TABLE "FormInputs" DROP CONSTRAINT "FormInputs_conditionalInputId_fkey";

-- DropForeignKey
ALTER TABLE "FormResponseInputs" DROP CONSTRAINT "FormResponseInputs_formInputId_fkey";

-- DropForeignKey
ALTER TABLE "FormResponseInputs" DROP CONSTRAINT "FormResponseInputs_formResponseId_fkey";

-- DropForeignKey
ALTER TABLE "FormResponses" DROP CONSTRAINT "FormResponses_formId_fkey";

-- DropForeignKey
ALTER TABLE "Forms" DROP CONSTRAINT "Forms_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Forms" DROP CONSTRAINT "Forms_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "InputOptions" DROP CONSTRAINT "InputOptions_formInputId_fkey";

-- AlterTable
ALTER TABLE "Forms" ALTER COLUMN "createdBy" DROP NOT NULL,
ALTER COLUMN "updatedBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "FileAssociation" ADD CONSTRAINT "FileAssociation_formInputId_fkey" FOREIGN KEY ("formInputId") REFERENCES "FormInputs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAssociation" ADD CONSTRAINT "FileAssociation_templateFileId_fkey" FOREIGN KEY ("templateFileId") REFERENCES "TemplateFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormInputs" ADD CONSTRAINT "FormInputs_conditionalInputId_fkey" FOREIGN KEY ("conditionalInputId") REFERENCES "FormInputs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InputOptions" ADD CONSTRAINT "InputOptions_formInputId_fkey" FOREIGN KEY ("formInputId") REFERENCES "FormInputs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponses" ADD CONSTRAINT "FormResponses_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseInputs" ADD CONSTRAINT "FormResponseInputs_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "FormResponses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseInputs" ADD CONSTRAINT "FormResponseInputs_formInputId_fkey" FOREIGN KEY ("formInputId") REFERENCES "FormInputs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
