import { FormResponseInputs, FileSpecs, FormResponses } from ".prisma/client";
import {FormInputWithRelations} from "@/services/FormInputs/models/formInput.model";

export type FormResponseInputWithRelations = FormResponseInputs & {
    FormResponse: FormResponses;
    FileSpecs: FileSpecs | null;
    FormInput: FormInputWithRelations;
}