/*
  Warnings:

  - Added the required column `isMultiple` to the `FormInputs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FormInputs" ADD COLUMN     "isMultiple" BOOLEAN NOT NULL;
