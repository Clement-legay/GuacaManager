import { FileAssociation } from ".prisma/client";
import { FormInputWithRelations } from "@/services/FormInputs/models/formInput.model";
import { TemplateFileWithRelations } from "@/services/TemplateFile/models/templateFile.model";

export type FileAssociationWithRelations = FileAssociation & {
    FormInput: FormInputWithRelations;
    TemplateFile: TemplateFileWithRelations;
}