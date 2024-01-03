import { FormResponses } from "@prisma/client";
import {FormWithRelations} from "@/services/Forms/models/form.model";
import {FormResponseInputWithRelations} from "@/services/FormResponses/models/formResponseInput.model";

export type FormResponseWithRelations = FormResponses & {
    Form: FormWithRelations;
    FormResponseInputs: FormResponseInputWithRelations[];
}