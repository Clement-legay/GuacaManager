/*
  Warnings:

  - A unique constraint covering the columns `[alias]` on the table `Forms` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FormInputs" ALTER COLUMN "label" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Forms" ADD COLUMN     "alias" TEXT,
ADD COLUMN     "isNotifying" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notificationEmails" TEXT[],
ALTER COLUMN "description" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Forms_alias_key" ON "Forms"("alias");
