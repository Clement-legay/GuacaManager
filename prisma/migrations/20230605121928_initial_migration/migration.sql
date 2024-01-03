-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcelFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExcelFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Forms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "excelFileId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormInputs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "placeholder" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL,
    "isConditional" BOOLEAN NOT NULL,
    "conditionalInputId" TEXT,
    "conditionalValue" TEXT,
    "excelCoordinates" TEXT,
    "formId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormInputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InputOptions" (
    "id" TEXT NOT NULL,
    "optionName" TEXT NOT NULL,
    "optionValue" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "formInputId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InputOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormResponses" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormResponses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormResponseInputs" (
    "id" TEXT NOT NULL,
    "formResponseId" TEXT NOT NULL,
    "formInputId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormResponseInputs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_excelFileId_fkey" FOREIGN KEY ("excelFileId") REFERENCES "ExcelFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormInputs" ADD CONSTRAINT "FormInputs_conditionalInputId_fkey" FOREIGN KEY ("conditionalInputId") REFERENCES "FormInputs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FormInputs" ADD CONSTRAINT "FormInputs_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InputOptions" ADD CONSTRAINT "InputOptions_formInputId_fkey" FOREIGN KEY ("formInputId") REFERENCES "FormInputs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponses" ADD CONSTRAINT "FormResponses_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseInputs" ADD CONSTRAINT "FormResponseInputs_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "FormResponses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseInputs" ADD CONSTRAINT "FormResponseInputs_formInputId_fkey" FOREIGN KEY ("formInputId") REFERENCES "FormInputs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
