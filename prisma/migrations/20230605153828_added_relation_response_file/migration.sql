/*
  Warnings:

  - A unique constraint covering the columns `[formResponseInputId]` on the table `FileSpecs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `formResponseInputId` to the `FileSpecs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isHidden` to the `FormInputs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `FormInputs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FileSpecs" ADD COLUMN     "formResponseInputId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FormInputs" ADD COLUMN     "isHidden" BOOLEAN NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FileSpecs_formResponseInputId_key" ON "FileSpecs"("formResponseInputId");

-- AddForeignKey
ALTER TABLE "FileSpecs" ADD CONSTRAINT "FileSpecs_formResponseInputId_fkey" FOREIGN KEY ("formResponseInputId") REFERENCES "FormResponseInputs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
