-- DropForeignKey
ALTER TABLE "FormInputs" DROP CONSTRAINT "FormInputs_formId_fkey";

-- AddForeignKey
ALTER TABLE "FormInputs" ADD CONSTRAINT "FormInputs_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
