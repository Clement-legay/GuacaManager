import { FormInputs } from ".prisma/client";
import { FormWithRelations } from "@/services/Forms/models/form.model";
import { FileAssociationWithRelations } from "@/services/FormInputs/models/fileAssociation.model";
import {InputOptionWithRelations} from "@/services/FormInputs/models/inputOption.model";
import {FormResponseInputWithRelations} from "@/services/FormResponses/models/formResponseInput.model";

export type FormInputWithRelations = FormInputs & {
    ConditionalInput: FormInputWithRelations | null;
    ConditionedFormInputs: FormInputWithRelations[];
    Form: FormWithRelations;
    InputOptions: InputOptionWithRelations[];
    Responses: FormResponseInputWithRelations[];
    FileAssociations: FileAssociationWithRelations[];
}