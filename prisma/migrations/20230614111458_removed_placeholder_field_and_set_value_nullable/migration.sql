/*
  Warnings:

  - You are about to drop the column `placeholder` on the `FormInputs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FormInputs" DROP COLUMN "placeholder",
ALTER COLUMN "value" DROP NOT NULL;
