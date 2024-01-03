-- AlterTable
ALTER TABLE "Forms" ALTER COLUMN "notificationEmails" DROP NOT NULL,
ALTER COLUMN "notificationEmails" SET DATA TYPE TEXT;
